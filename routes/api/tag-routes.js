const router = require('express').Router();
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

// function responds to the client request by retrieving all Tags and their associated Product data from the database.
router.get('/', async (req, res) => {
  try {
    const result = await Tag.findAll({
      include: [
        { model: Product },
      ]
    })

    if (result.length < 1) {
      return res.status(404).json({ message: 'Tags could not be found.' });
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});


// function responds to the client request by retrieving a specific Tag and its associated Product data from the database based on the ID provided by the client.
router.get('/:id', async (req, res) => {
  try {
    const result = await Tag.findByPk(req.params.id, {
      include: [
        { model: Product }
      ]
    })

    if (!result) {
      return res.status(404).json({ message: `Tag with the ID (${req.params.id}) could not be found!` })
    }

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});


// function creates a new Tag item in the database based on the tag_name value provided by the client.
router.post('/', async (req, res) => {
  try {
    const result = await Tag.create(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});


// function updates a Tag item in the database based on the ID and new tag_name value provided by the client.
router.put('/:id', async (req, res) => {
  try {
    const ifExist = await Tag.findByPk(req.params.id);

    if (!ifExist) {
      return res.status(404).json({ message: `The Tag corresponding to the provided ID (${req.params.id}) could not be found!` });
    }

    const result = await Tag.update(
      { tag_name: req.body.tag_name },
      { where: {
        id: req.params.id },
      })

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});


// function removes a Tag item from the database based on the ID provided by the client.
router.delete('/:id', async (req, res) => {
  try {
    const ifExist = await Tag.findByPk(req.params.id);

    if (!ifExist) {
      return res.status(404).json({ message: `The Tag corresponding to the provided ID (${req.params.id}) could not be found!` });
    }

    const result = await Tag.destroy({
      where: {
        id: req.params.id 
      },
    })

    res.status(200).json(result);
  } catch (error) {
    res.status(500).json(error);
  }
});


module.exports = router;
