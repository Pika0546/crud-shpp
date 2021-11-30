const express = require('express');
const router = express.Router();

const AccountController = require('../controllers/AccountController');

router.get('/register-login', AccountController.registerLogin);
router.get('/forgot-password', AccountController.forgotPassword);
router.get('/verification-code', AccountController.verificationCode);
router.get('/new-password', AccountController.newPassword);
router.get('/register-success', AccountController.registerSuccess);
module.exports = router;
