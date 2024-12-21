const express = require('express');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const { isAuthProtected, isRestricted } = require('../middlewares/protected');
const { uploadSingleImage, resizeSingleUserImage } = require('../middlewares/multer');

//////////////////////////////////////////////////
//////////////////////////////////////////////////
const router = express.Router();


// ROUTE FOR PROTECTED USER
router.get('/me', isAuthProtected, userController.getMe);
// router.patch('/upload-image', uploadSingleImage, resizeSingleUserImage, isAuthProtected, userController.uploadProfileImage);
router.patch('/delete-account', isAuthProtected, userController.deleteAccount);
router.patch('/update-password', isAuthProtected, authController.updatePassword);


// ROUTES RESTRICTED TO JUST ADMINS
router.get('/', isAuthProtected, isRestricted, userController.getEveryUsers);
router.get('/:id', isAuthProtected, isRestricted, userController.getUserById);
router.patch('/:id', isAuthProtected, isRestricted, userController.updateUser);
router.delete('/:id', isAuthProtected, isRestricted, userController.deleteUser);

module.exports = router;