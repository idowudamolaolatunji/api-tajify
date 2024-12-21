const express = require('express');
const walletController = require('../controllers/walletController');
const { isAuthProtected, isRestricted } = require('../middlewares/protected');

//////////////////////////////////////////////////
//////////////////////////////////////////////////
const router = express.Router();


router.get("/", isAuthProtected, isRestricted, walletController.getAllUserWallets);
router.get("/:id", isAuthProtected, isRestricted, walletController.getOneUserWalletById);
router.delete("/:id", isAuthProtected, isRestricted, walletController.deleteUserWallet);

router.get("/my-balance", isAuthProtected, walletController.getBalance);
router.post("/create", isAuthProtected, walletController.createUserWallet);

module.exports = router;