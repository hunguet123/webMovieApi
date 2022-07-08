const express = require('express');
const router = express.Router();
const siteController = require('../controllers/site.controller.js');

router.get('/', siteController.home);
router.get('/share/qr', siteController.shareByQR);
router.post('/search-by-text', siteController.searchByText);
router.get('/public', siteController.public )

module.exports = router;
