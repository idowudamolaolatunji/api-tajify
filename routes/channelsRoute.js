const express = require('express');
const channelsController = require('../controllers/channelsController');
const { isAuthProtected, isRestricted } = require('../middlewares/protected');
const { uploadVideo, uploadAudio } = require('../middlewares/multer');

//////////////////////////////////////////////////
//////////////////////////////////////////////////
const router = express.Router();


router.get("/tubes", channelsController.getTubes);
router.get("/tubes/:id", channelsController.getOneTubeById);

router.get("/tubes/my-tube", isAuthProtected, channelsController.getAllMyTubes);
router.get("/tubes/all-tubes", isAuthProtected, isRestricted, channelsController.getAllTubes);

router.patch("/tubes/:id", isAuthProtected, channelsController.updateOneTubeById);
router.delete("/tubes/:id", isAuthProtected, channelsController.deleteOneTubeById);

router.post("/tubes/upload", uploadVideo, isAuthProtected, channelsController.uploadTube);


router.get("/radios/:location", channelsController.getRadioStations);
router.get("/radios/:id/listen", channelsController.getRadioStationById);


router.post("/audio/upload", uploadAudio, isAuthProtected, channelsController.uploadMusicAudio)

module.exports = router;