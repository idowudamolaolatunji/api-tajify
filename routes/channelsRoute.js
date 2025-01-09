const express = require('express');
const channelsController = require('../controllers/channelsController');
const { isAuthProtected, isRestricted } = require('../middlewares/protected');
const { uploadSingleTube, uploadSingleAudio } = require('../middlewares/multer');

//////////////////////////////////////////////////
//////////////////////////////////////////////////
const router = express.Router();


router.get("/tubes", channelsController.getTubes);
router.get("/tubes/:id", channelsController.getOneTubeById);

router.get("/tubes/my-tube", isAuthProtected, channelsController.getAllMyTubes);
router.get("/tubes/all-tubes", isAuthProtected, isRestricted, channelsController.getAllTubes);

router.patch("/tubes/:id", isAuthProtected, channelsController.updateOneTubeById);
router.delete("/tubes/:id", isAuthProtected, channelsController.deleteOneTubeById);

router.post("/tubes/upload", uploadSingleTube, isAuthProtected, channelsController.uploadTube);
router.post("/audio/upload", uploadSingleAudio, isAuthProtected, channelsController.uploadMusicAudio);

router.get("/radios/:location", channelsController.getRadioStations);
router.get("/radios/:id/listen", channelsController.getRadioStationById);

module.exports = router;