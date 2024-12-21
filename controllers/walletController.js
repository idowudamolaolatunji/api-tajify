const Wallet = require("../models/walletsModel");
const { asyncWrapper } = require("../utils/handlers");
const refactory = require("./handleRefactory");


exports.getAllUserWallets = refactory.getAll(Wallet, "wallet");
exports.getOneUserWalletById = refactory.getOne(Wallet, "wallet");

exports.createUserWallet = refactory.createOne(Wallet, "wallet", "user");
exports.deleteUserWallet = refactory.deleteOne(Wallet, "wallet");

exports.getBalance = asyncWrapper(async function(req, res) {
    const userId = req.user._id;

    const userWallet = await Wallet.findOne({ user: userId });
    if(!userWallet) return res.json({ message: "You dont have a wallet yet" });

    res.status(200).json({
        status: "success",
        data: { balance: userWallet.balance }
    })
})