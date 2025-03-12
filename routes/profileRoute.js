const express = require('express');
const { isAuthProtected, isRestricted } = require('../middlewares/protected');
const profileController = require("../controllers/profileController");

//////////////////////////////////////////////////
//////////////////////////////////////////////////
const router = express.Router();


router.get("/", isAuthProtected, profileController.getAllProfiles)
router.get("/my-profile", isAuthProtected, profileController.getMyProfile)
router.get("/:id", isAuthProtected, profileController.getProfileById)
router.post("/become-a-creator", isAuthProtected, isRestricted(["user"]), profileController.becomeCreator);

router.get("/creators/profiles", isAuthProtected, profileController.fetchCreators)


////////////////////////////////////////////////////

router.patch("/follow-creator", isAuthProtected, profileController.followCreator);
router.patch("/unfollow-cretor", isAuthProtected, profileController.unfollowCreator);
router.patch("/follow-creator/back", isAuthProtected, profileController.followBackCreator);

////////////////////////////////////////////////////
router.get("/followers", isAuthProtected, profileController.getMyFollowers);
router.get("/followings", isAuthProtected, profileController.getMyFollowings);


module.exports = router;