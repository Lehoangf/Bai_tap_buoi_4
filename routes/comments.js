var express = require('express');
var router = express.Router();

let comments = [ 
  { "id": "1", "text": "a comment about post 1", "postId": "1", "isDelete": false },
  { "id": "2", "text": "another comment about post 1", "postId": "1", "isDelete": false }
]

/* GET users listing - ẩn các comment có isDelete = true */
router.get('/', function(req, res, next) {
  const activeComments = comments.filter(c => !c.isDelete);
  res.send({
    success: true,
    data: activeComments
  });
});

router.get('/:id', function(req, res, next) {
  const comment = comments.filter(c => c.id == req.params.id && !c.isDelete);
  res.send({
    success: true,
    data: comment
  });
});

/* POST tạo comment mới */
router.post('/', function(req, res, next) {
  try {
    const newComment = {
      id: (comments.length + 1).toString(),
      text: req.body.text,
      postId: req.body.postId,
      isDelete: false
    };
    comments.push(newComment);
    res.send({
      success: true,
      data: newComment
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      data: error
    });
  }
});

/* PUT cập nhật comment */
router.put('/:id', function(req, res, next) {
  try {
    const commentIndex = comments.findIndex(c => c.id == req.params.id && !c.isDelete);
    if (commentIndex === -1) {
      return res.status(404).send({
        success: false,
        message: "Comment not found"
      });
    }
    
    comments[commentIndex].text = req.body.text || comments[commentIndex].text;
    comments[commentIndex].postId = req.body.postId || comments[commentIndex].postId;
    
    res.send({
      success: true,
      data: comments[commentIndex]
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      data: error
    });
  }
});

/* DELETE soft delete - đổi isDelete về true */
router.delete('/:id', function(req, res, next) {
  try {
    const commentIndex = comments.findIndex(c => c.id == req.params.id && !c.isDelete);
    if (commentIndex === -1) {
      return res.status(404).send({
        success: false,
        message: "Comment not found"
      });
    }
    
    comments[commentIndex].isDelete = true;
    
    res.send({
      success: true,
      message: "Comment deleted successfully",
      data: comments[commentIndex]
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      data: error
    });
  }
});

module.exports = router;
