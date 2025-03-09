const express = require('express');
const connectController = require('../controllers/connectController');
const { isAuthProtected, isRestricted } = require('../middlewares/protected');
//////////////////////////////////////////////////
//////////////////////////////////////////////////
const router = express.Router();



module.exports = router;