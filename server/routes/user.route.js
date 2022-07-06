const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
let checkSession = require('../middlewares/check-session.js');
let upload = require('../middlewares/upload-image');

const saved_image_folder = 'avatar';
const upload_image_field = 'file';

//=========================//
//TODO: remove in last version
router.get('/login', userController.login);
router.post('/submit-login', userController.verifyLogin);
router.get('/index.css',userController.index);
router.get('/asset', userController.asset);
//Server
router.post('/confirm-email', userController.confirmEmail);
router.get('/activate-account/:token', userController.activateAccount);
router.post('/register/:token', userController.submitRegister);
router.get('/register/:token', userController.register);


module.exports = router;
