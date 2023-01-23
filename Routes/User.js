const express = require('express');
const router = express.Router();
const UserController = require('../Controller/UserController');
const UserEmailVerification = require('../Schemas/UserEmailVerification');
router.get('/', UserController.GET_ALL_USER);
router.get('/:id', UserController.GET_USER_BY_ID);
router.post('/verifyOTP', UserController.VERIFY_OTP);
router.post('/Signup', UserController.SIGNUP_USER);
router.post('/Login', UserController.LOGIN_USER);
router.patch('/:userId', UserController.EDIT_USER_NUMBER);

module.exports = router;