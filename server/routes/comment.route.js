const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/comment.controller');
let checkSession = require('../middlewares/check-session.js');

router.get('/:id' , CommentController.CommentOfMovie);
router.get('/movie/sender/:sender_id/:movie_id', CommentController.CommentBySenderInMovie);


// router.get('/inputComment', CommentController.inputComment );
// router.get('/pushicon',CommentController.pushIcon);
// router.get('/changeicon', CommentController.changeIcon);
// router.get('/inputRepComment', CommentController.inputRepComment);
// router.get('/pushRepIcon', CommentController.pushRepIcon);
// router.get('/changeRepIcon', CommentController.changeRepIcon);
module.exports = router;
