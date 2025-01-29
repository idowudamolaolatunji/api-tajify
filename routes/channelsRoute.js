const express = require('express');
const channelsController = require('../controllers/channelsController');
const { isAuthProtected, isRestricted } = require('../middlewares/protected');
const { uploadSingleTube, uploadSingleAudio, uploadSingleImage, uploadEbook, uploadAudioBook } = require('../middlewares/multer');

//////////////////////////////////////////////////
//////////////////////////////////////////////////
const router = express.Router();



//////////////////////////////////////////////////
// TUBES
//////////////////////////////////////////////////
router.get("/tubes", channelsController.getTubes);
router.get("/tubes/:id", channelsController.getOneTubeById);

router.get("/tubes/my-tube", isAuthProtected, channelsController.getAllMyTubes);
router.get("/tubes/all-tubes", isAuthProtected, isRestricted, channelsController.getAllTubes);
router.post("/tubes/upload", uploadSingleTube, isAuthProtected, channelsController.uploadTube);

router.patch("/tubes/:id", isAuthProtected, channelsController.updateOneTubeById);
router.delete("/tubes/:id", isAuthProtected, channelsController.deleteOneTubeById);

 
 
//////////////////////////////////////////////////
// MUSIC
//////////////////////////////////////////////////
router.get("/music", isAuthProtected, isRestricted, channelsController.getAllMusic);
router.get("/music/:id", channelsController.getOneMusicById);
router.get("/music/my-music", isAuthProtected, channelsController.getAllMyMusic);
router.post("/music/upload", uploadSingleAudio, isAuthProtected, channelsController.uploadMusicAudio);

router.patch("/music/:id", isAuthProtected, channelsController.updateOneMusicById);
router.delete("/music/:id", isAuthProtected, channelsController.deleteOneMusicById);



//////////////////////////////////////////////////
// PODCASTS
//////////////////////////////////////////////////
router.get("/podcasts", isAuthProtected, isRestricted, channelsController.getAllPodcasts);
router.get("/podcasts/:id", channelsController.getOnePodcastById);
router.get("/podcasts/my-podcasts", isAuthProtected, channelsController.getAllMyPodcasts);

router.post("/podcasts/create", uploadSingleImage, isAuthProtected, channelsController.createPodcast);
router.post("/podcasts/episode/:id", uploadSingleAudio, isAuthProtected, channelsController.uploadEpisode);

router.patch("/podcasts/:id", isAuthProtected, channelsController.updateOnePodcastById);
router.delete("/podcasts/:id", isAuthProtected, channelsController.deleteOnePodcastById);

//////////////////////////////////////////////////
////////BOOKS
//////////////////////////////////////////////////

router.get("/books", isAuthProtected, isRestricted, channelsController.getAllBooks);
router.get("/books/:id", channelsController.getOneBookById);
router.get("/books/my-books", isAuthProtected, channelsController.getAllMyBooks);

router.post("/books/upload", uploadEbook, isAuthProtected,  channelsController.createEBook);
router.post("/books/upload-audio", uploadAudioBook, isAuthProtected, channelsController.createAudioBook);

router.put("/books/:id", isAuthProtected, channelsController.updateOneBookById);
router.delete("/books/:id", isAuthProtected, channelsController.deleteOneBookById);

 
module.exports = router; 