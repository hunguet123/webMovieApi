const express = require('express');
const router = express.Router();
const CommentController = require('../controllers/comment.controller');
let checkSession = require('../middlewares/check-session.js');

router.get('/', checkSession, CommentController.CommentOfMovie);

module.exports = router;
