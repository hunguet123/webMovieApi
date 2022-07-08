const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller.js');
let checkSession = require('../middlewares/check-session.js');
let upload = require('../middlewares/upload-image');


router.get('/login', userController.login);
router.post('/submit-login', userController.verifyLogin);
//Server
router.post('/activate-account/:token', userController.activateAccount);
router.post('/register', userController.submitRegister);
router.get('/register', userController.register);
router.post('/email/excited', userController.emailExcited);
router.get('/enter-code/:token', userController.enterCode);

module.exports = router;
