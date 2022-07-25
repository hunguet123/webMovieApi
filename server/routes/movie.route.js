const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller.js');
let checkSession = require('../middlewares/check-session.js');

router.get('/', checkSession ,movieController.movieList);
router.get('/update_views', checkSession ,movieController.updateViews);

module.exports = router;
