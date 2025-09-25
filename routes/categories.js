var express = require('express');
var router = express.Router();
let categoryModel = require('../schemas/category')

/* GET tất cả categories - ẩn các category có isDelete = true */
router.get('/', async function(req, res, next) {
  try {
    let categories = await categoryModel.find({ isDelete: false })
    res.send({
      success: true,
      data: categories
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      data: error
    });
  }
});

/* GET category theo ID */
router.get('/:id', async function(req, res, next) {
  try {
    let item = await categoryModel.findOne({ _id: req.params.id, isDelete: false });
    if (!item) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }
    res.send({
      success: true,
      data: item
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      data: error
    })
  }
});

/* POST tạo category mới */
router.post('/', async function(req, res, next) {
  try {
    let newItem = new categoryModel({
      name: req.body.name
    })
    await newItem.save()
    res.send({
      success: true,
      data: newItem
    })
  } catch (error) {
    res.status(400).send({
      success: false,
      data: error
    })
  }
})

/* PUT cập nhật category */
router.put('/:id', async function(req, res, next) {
  try {
    let updatedItem = await categoryModel.findOneAndUpdate(
      { _id: req.params.id, isDelete: false },
      {
        name: req.body.name
      }, {
        new: true
      }
    )
    
    if (!updatedItem) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }
    
    res.send({
      success: true,
      data: updatedItem
    })
  } catch (error) {
    res.status(400).send({
      success: false,
      data: error
    })
  }
})

/* DELETE soft delete - đổi isDelete về true */
router.delete('/:id', async function(req, res, next) {
  try {
    let deletedItem = await categoryModel.findOneAndUpdate(
      { _id: req.params.id, isDelete: false },
      { isDelete: true },
      { new: true }
    )
    
    if (!deletedItem) {
      return res.status(404).send({
        success: false,
        message: "Category not found"
      });
    }
    
    res.send({
      success: true,
      message: "Category deleted successfully",
      data: deletedItem
    })
  } catch (error) {
    res.status(400).send({
      success: false,
      data: error
    })
  }
})

module.exports = router;