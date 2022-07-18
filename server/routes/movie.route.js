const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller.js');
let checkSession = require('../middlewares/check-session.js');
let upload = require('../middlewares/upload-image');

router.get('/', checkSession ,movieController.movieList);

module.exports = router;
