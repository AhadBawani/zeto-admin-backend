const express = require('express');
const router = express.Router();
const UserController = require('../Controller/UserController');
const UserEmailVerification = require('../Schemas/UserEmailVerification');

router.get('/', UserController.GET_ALL_USER);
router.get('/:id', UserController.GET_USER_BY_ID);
router.post('/Signup', UserController.SIGNUP_USER);
router.post('/Login', UserController.LOGIN_USER);
router.patch('/:userId', UserController.EDIT_USER_NUMBER);
router.post('/ForgotPassword', UserController.FORGOT_PASSWORD);
router.post('/Verifyotp', UserController.VERIFY_OTP);
router.post('/ChangePassword', UserController.CHANGE_PASSWORD);
router.put('/EditUser/:userId', UserController.EDIT_USER);
router.post('/AdminSignup', UserController.ADMIN_SIGNUP);

module.exports = router;