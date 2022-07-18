const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movie.controller.js');
let checkSession = require('../middlewares/check-session.js');

router.get('/' ,movieController.movieList);
router.get('/update_views', movieController.updateViews);

module.exports = router;
