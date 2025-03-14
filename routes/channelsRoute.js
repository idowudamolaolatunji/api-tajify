const express = require('express');
const channelsController = require('../controllers/channelsController');
const { isAuthProtected, isRestricted } = require('../middlewares/protected');
const { uploadSingleTube, uploadSingleAudio, uploadSingleImage, uploadSingleBook } = require('../middlewares/multer');

//////////////////////////////////////////////////
//////////////////////////////////////////////////
const router = express.Router();


//////////////////////////////////////////////////
// TUBES
//////////////////////////////////////////////////
router.get("/tubes", isAuthProtected, channelsController.getTubes);
router.get("/tubes/:id", isAuthProtected, channelsController.getOneTubeById);

router.get("/tubes/my-tubes", isAuthProtected, channelsController.getAllMyTubes);
router.get("/tubes/all-tubes", isAuthProtected, isRestricted, channelsController.getAllTubes);
router.post("/tubes/upload", uploadSingleTube, isAuthProtected, channelsController.uploadTube);

router.patch("/tubes/:id", isAuthProtected, channelsController.updateOneTubeById);
router.delete("/tubes/:id", isAuthProtected, channelsController.deleteOneTubeById);

 
//////////////////////////////////////////////////
// MUSIC
//////////////////////////////////////////////////
router.get("/music", isAuthProtected, isRestricted, channelsController.getAllMusic);
router.get("/music/:id", channelsController.getOneMusicById);
router.get("/music/my-musics", isAuthProtected, channelsController.getAllMyMusic);
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
// BOOKS
//////////////////////////////////////////////////
router.get("/books", isAuthProtected, channelsController.getAllBooks);
router.get("/books/:id", isAuthProtected, channelsController.getBookById);
router.post("/books/upload", uploadSingleBook, isAuthProtected, channelsController.createBook);
router.get("/books/my-books", isAuthProtected, channelsController.getAllMyBooks);

router.patch("/books/:id", isAuthProtected, channelsController.updateBook);
router.delete("/books/:id", isAuthProtected, channelsController.deleteBook);


////////////////////////////////////////////////// 
// BLOGS
//////////////////////////////////////////////////
router.get("/blogs", isAuthProtected, channelsController.getAllBlogPosts);
router.get("/blogs/:id", isAuthProtected, channelsController.getBlogPostById);
router.post("/blogs/post", isAuthProtected, channelsController.createBlogPost);
router.get("/blogs/my-blogs", isAuthProtected, channelsController.getAllMyBlogPosts);


////////////////////////////////////////////////// 
// PICS IMAGE
//////////////////////////////////////////////////
router.get("/pics", isAuthProtected, channelsController.getAllPics);
router.get("/pics/:id", isAuthProtected, channelsController.getPicsById);
router.post("/pics/upload", uploadSingleImage, isAuthProtected, channelsController.uploadPics);
router.get("/pics/my-images", isAuthProtected, channelsController.getAllMyPics);

 
module.exports = router; 