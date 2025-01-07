const express = require('express');
const { isAuthProtected, isRestricted } = require('../middlewares/protected');
const profileController = require("../controllers/profileController");

//////////////////////////////////////////////////
//////////////////////////////////////////////////
const router = express.Router();


router.get("/", isAuthProtected, isRestricted, profileController.getAllProfiles)
router.get("/my-profile", isAuthProtected, profileController.getMyProfile)
router.post("/become-a-creator", isAuthProtected, isRestricted(["user"]), profileController.becomeCreator);


module.exports = router;