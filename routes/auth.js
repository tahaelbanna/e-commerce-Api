const express = require('express');
const authController = require('../controllers/auth');

const router = express.Router();
const Validators = require('../utils/validators/auth');

router.post('/signup', Validators.checkSignUp, authController.signUp);
router.post('/login', Validators.checkLogIn, authController.logIn);
router.post('/forgotPassword', authController.forgetPassword);
router.post('/verifyResetCode', authController.verifyResetCode);
router.put('/resetPassword', authController.resetPassword);



module.exports = router;
