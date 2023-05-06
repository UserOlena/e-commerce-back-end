const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// function responds to the client request by retrieving all Products and their associated Category and Tag data from the database.
router.get('/', async (req, res) => {
  try {
    const result = await Product.findAll({
      include: [
        { model: Category },
        { model: Tag },
      ]
    })

    if (result.length < 1) {
      res.sendStatus(400).json({ message: `The Products could not be found!`});
      return;
    }
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});


// function responds to the client request by retrieving a specific Product and its associated Category and Tag data from the database based on the ID provided by the client.
router.get('/:id', async (req, res) => {
  try {
    const result = await Product.findByPk(req.params.id, {
      include: [
        { model: Category },
        { model: Tag },
      ]
    })

    if (!result) {
      res.status(404).json({ message: `The Product corresponding to the provided ID (${req.params.id}) could not be found!`});
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});


// function creates a new Product item in the database using the provided product_name, price, and stock values. It also performs bulk creation of ProductTag records based on the newly created product_id and tag_id values supplied by the client.
router.post('/', async (req, res) => {
  Product.create(req.body)
    .then(product => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map(tag_id => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then(productTagIds => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});


// update product
router.put('/:id', (req, res) => {
  // update product data
  Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then((product) => {
      // find all associated tags from ProductTag
      return ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then((productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ 
          where: { 
            id: productTagsToRemove 
          } 
        }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});


// 
router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value
  try {
    const result = await Product.destroy({
      where: {
        id: req.params.id
      }
    })
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});

module.exports = router;
