const express = require('express');
const tubeController = require('../controllers/tubeController');
const { isAuthProtected, isRestricted } = require('../middlewares/protected');
const { uploadVideo } = require('../middlewares/multer');

//////////////////////////////////////////////////
//////////////////////////////////////////////////
const router = express.Router();


router.get("/", tubeController.getTubes);
router.get("/:id", tubeController.getOneTubeById);

router.get("/my-tube", isAuthProtected, tubeController.getAllMyTubes);
router.get("/all-tubes", isAuthProtected, isRestricted, tubeController.getAllTubes);

router.patch("/:id", isAuthProtected, tubeController.updateOneTubeById);
router.delete("/:id", isAuthProtected, tubeController.deleteOneTubeById);

router.post("/create", isAuthProtected, tubeController.createTube);
router.post("/upload-video/:id", uploadVideo, isAuthProtected, tubeController.uploadTubeVideo);

module.exports = router;