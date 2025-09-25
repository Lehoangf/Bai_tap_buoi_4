var express = require('express');
var router = express.Router();
let productModel = require('../schemas/product')



/* GET users listing - ẩn các product có isDelete = true */
router.get('/', async function(req, res, next) {
  let products = await productModel.find({ isDelete: false })
  res.send({
    success: true,
    data:products
  });
});
router.get('/:id', async function(req, res, next) {
  try {
    let item = await productModel.findOne({ _id: req.params.id, isDelete: false });
    if (!item) {
      return res.status(404).send({
        success: false,
        message: "Product not found"
      });
    }
    res.send({
      success: true,
      data:item
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      data:error
    })
  }
});
router.post('/', async function(req,res,next){
  try {
    let newItem = new productModel({
      name: req.body.name,
      price:req.body.price,
      description:req.body.description,
      category:req.body.category
    })
    await newItem.save()
    res.send({
      success: true,
      data:newItem
    })
  } catch (error) {
    res.status(404).send({
      success: false,
      data:error
    })
  }
})
router.put('/:id', async function(req,res,next){
  try {
    let updatedItem = await productModel.findOneAndUpdate(
      { _id: req.params.id, isDelete: false },
      {
        name:req.body.name,
        price:req.body.price,
        description:req.body.description,
        category:req.body.category
      },{
        new:true
      }
    )
    
    if (!updatedItem) {
      return res.status(404).send({
        success: false,
        message: "Product not found"
      });
    }
    
    res.send({
        success: true,
        data:updatedItem
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
    let deletedItem = await productModel.findOneAndUpdate(
      { _id: req.params.id, isDelete: false },
      { isDelete: true },
      { new: true }
    )
    
    if (!deletedItem) {
      return res.status(404).send({
        success: false,
        message: "Product not found"
      });
    }
    
    res.send({
      success: true,
      message: "Product deleted successfully",
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
