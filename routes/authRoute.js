const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { isAuthProtected, isRestricted } = require('../middlewares/protected');
const { uploadSingleImage, resizeSingleUserImage } = require('../middlewares/multer');

//////////////////////////////////////////////////
//////////////////////////////////////////////////
const router = express.Router();


// AUTH ROUTES
router.post('/signup', authController.signupUser);
router.post('/login', authController.loginUser);
router.get('/logout', authController.logoutUser);

// VERIFICATION ROUTES
router.patch('/verify-otp', authController.verifyOtp);
router.patch('/request-otp', authController.requestOtp);

// FORGOT AND RESET ROUTES
router.patch('/forgot-password', authController.forgotPassword);
router.patch('/reset-password/:token', authController.resetPassord);

module.exports = router;