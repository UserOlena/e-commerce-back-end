const router = require('express').Router();
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

// function responds to the client request by retrieving all categories and their associated products from the database.
router.get('/', async (req, res) => {
  try {
    const result = await Category.findAll({
      include: [
        {model: Product}
      ]
    })
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }

});


// function responds to the client request by retrieving a category item and its associated products from the database based on the provided ID.
router.get('/:id', async (req, res) => {
  try {
    const result = await Category.findByPk(req.params.id, {
      include: [
        {model: Product}
      ]
    })

    if (!result) {
      res.status(404).json({ message: `The category corresponding to the provided ID (${req.params.id}) could not be found!`});
      return;
    } else {
      res.status(200).json(result);
    }
  } catch (error) {
    res.status(500).json(error);
  }
});


// function creates a new category item in the database based on the category_name value provided by the client.
router.post('/', async (req, res) => {
  try {
    const result = await Category.create(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});


// function updates a category item in the database based on the ID and new category_name value provided by the client.
router.put('/:id', async (req, res) => {
  try {
    const result = await Category.update(
      { category_name: req.body.category_name }, 
      { where: {
        id: req.params.id, }
      });
   
      if (!result) {
        res.status(404).json({ message: `The category corresponding to the provided ID (${req.params.id}) could not be found!`});
      } else {
        res.status(200).json(result);
      }
  } catch (error) {
    res.status(500).json(error);
  }
});


// function removes a category item from the database based on the ID provided by the client.
router.delete('/:id', async (req, res) => {
  try {
    const result = await Category.destroy({
      where: {
        id: req.params.id,
      }
    })

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});


module.exports = router;
