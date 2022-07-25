const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/comment.controller');
let checkSession = require('../middlewares/check-session.js');

router.get('/', checkSession, CommentController.CommentOfMovie);
router.get('/inputComment/:id', CommentController.inputComment );

module.exports = router;
