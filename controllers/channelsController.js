
const Tube = require("../models/tubesModel");
const { asyncWrapper } = require("../utils/handlers");
const refactory = require("./handleRefactory");
const cloudinary = require("../utils/cloudinary");
const Audio = require("../models/audioModel");
const Comment = require("../models/commentModel");
const Profile = require("../models/profile");
const Podcast = require("../models/podcastModel");
const { FirstCap } = require("../utils/helpers");
const Book = require("../models/booksModel");
////////////////////////////////////////////////////
////////////////////////////////////////////////////



//////////////////////////////////////////////////
// VIDEOS AND TUBES
//////////////////////////////////////////////////
exports.getAllTubes = refactory.getAll(Tube, "tube");
exports.getAllMyTubes = refactory.getAllMine(Tube, "tube");
exports.getOneTubeById = refactory.getOne(Tube, "tube");
exports.updateOneTubeById = refactory.updateOne(Tube, "tube");
exports.deleteOneTubeById = refactory.updateOne(Tube, "tube");

exports.getTubes = asyncWrapper(async function(req, res) {
    const { type, limit, page } = req.query;

    const query = {};
    if (type) query.type = type;

    const paginationOptions = {};
    if (limit) paginationOptions.limit = parseInt(limit);
    if (page) paginationOptions.skip = (parseInt(page) - 1) * paginationOptions.limit;

    const weights = {
        views: 0.4,
        likes: 0.3,
        comments: 0.2,
        shares: 0.2,
        saves: 0.1,
    };
  
    const tubes = await Tube.aggregate([
        { $match: query },
        {
            $addFields: {
                weight: {
                    $add: [
                        { $multiply: ["$views", weights.views] },
                        { $multiply: ["$likes", weights.likes] },
                        { $multiply: ["$comments", weights.comments] },
                        { $multiply: ["$shares", weights.shares] },
                        { $multiply: ["$saves", weights.saves] },
                    ]
                }
            }
        },
        {
            $sort: {
                weight: -1
            }
        },
        { $sort: { weight: -1 } },
        { $skip: paginationOptions.skip },
        { $limit: paginationOptions.limit }
    ]);


    res.status(200).json({
        status: "success",
        data: {
            tubes
        }
    })
});

exports.uploadTube = asyncWrapper(async function(req, res) {
    const userId = req.user._id;
    const tubeFile = req.files.tube[0];
    const thumbnailFile = req.files.thumbnail[0];
    const { type, title, description, hashTags } = req.body;

    const creator = await Profile.findOne({ user: userId, isCreator: true });
    if(!creator) return res.json({ message: "Only creators can upload tube "});
    if(!tubeFile || !thumbnailFile) return res.json({ message: "Tube video and thumbnail are required!" })

    // UPLOAD THE TUBE THUMBNAIL
    const thumbnailFileUpload = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(thumbnailFile.path, {
            resource_type: 'image',
            public_id: `tube-thumbnail-${Date.now()}`,
            format: "jpeg",
        }, function(err, result) {
            if (err) reject(new Error(`Error uploading tube thumbnail!`));
            else resolve(result.public_id);
        });
    });

    // CROP THE TUBE THUMBNAIL
    const thumbnail_public_id = await thumbnailFileUpload;
    const thumbnailCroppedUrl = await cloudinary.url(thumbnail_public_id, {
        gravity: "auto",
        width: type !== "tube-short" ? 1280 : 1080,
        height: type !== "tube-short" ? 720 : 1950,
        crop: "fill",
        quality: 80
    })
    const thumbnailData = { url: thumbnailCroppedUrl, public_id: thumbnail_public_id }

    // UPLOAD THE TUBE VIDEO
    const tubeFileUpload = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(tubeFile.path, {
            resource_type: 'video',
            public_id: `tube-video-${Date.now()}`,
            format: 'mp4',
        }, function(err, result) {
            if (err) reject(new Error(`Error uploading tube video!`));
            else resolve(result);
        });
    });

    // CROP THE TUBE VIDEO
    const tubeResult = await tubeFileUpload;
    const tubeCroppedUrl = await cloudinary.url(tubeResult.public_id, {
        width: type !== "tube-short" ? 1280 : 1080,
        height: type !== "tube-short" ? 720 : 1950,
        crop: "fill",
        quality: 80,
        resource_type: 'video',
        version: tubeResult.version,
    });
    const tubeData = {
        url: tubeCroppedUrl,
        public_id: tubeResult.public_id,
        duration_in_sec: tubeResult.duration
    }

    const tube = await Tube.create({
        creatorProfile: creator._id,
        video: tubeData,
        thumbnail: thumbnailData,
        title, description, type,
        ...(hashTags && { hashTags: JSON.parse(hashTags) })
    });

    res.status(201).json({
        status: "success",
        message: "Tube Uploaded",
        data: { tube }
    });
});


//////////////////////////////////////////////////
// AUDIO AND MUSIC
//////////////////////////////////////////////////
exports.uploadMusicAudio = asyncWrapper(async function(req, res) {
    const userId = req.user._id;
    const audioFile = req.files.audio[0];
    const coverImageFile = req.files.coverImage[0];
    const { title, description } = req.body;

    const creator = await Profile.findOne({ user: userId, isCreator: true });
    if(!creator) return res.json({ message: "Only creators can upload audio!" });
    if(!audioFile || !coverImageFile) return res.json({ message: "Music file and cover image not uploaded correctly!" })

    // UPLOAD THE AUDIO COVER IMAGE
    const coverImageFileUpload = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(coverImageFile.path, {
            resource_type: 'image',
            public_id: `audio-coverimage-${Date.now()}`,
            format: "jpeg",
        }, function(err, result) {
            if (err) reject(new Error(`Error uploading cover image!`));
            else resolve(result.public_id);
        });
    });

    // CROP THE AUDIO COVER IMAGE
    const coverImage_public_id = await coverImageFileUpload;
    const coverImageCroppedUrl = await cloudinary.url(coverImage_public_id, {
        gravity: "auto",
        width: 500,
        height: 500,
        crop: "fill",
        quality: 70
    })
    const coverImageData = { url: coverImageCroppedUrl, public_id: coverImage_public_id }

    // UPLOAD THE AUDIO FILE
    const audioFileUpload = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(audioFile.path, {
            resource_type: 'auto',
            public_id: `audio-file-${Date.now()}`,
            format: 'mp3'
        }, function(err, result) {
            if (err) reject(new Error(`Error uploading audio!`));
            else resolve({ audio_public_id: result.public_id, audioUrl: result.secure_url, duration_in_sec: result.duration });
        });
    });

    const { audio_public_id, audioUrl, duration_in_sec } = await audioFileUpload;
    const audioData = { url: audioUrl, public_id: audio_public_id, duration_in_sec }

    const audio = await Audio.create({
        creatorProfile: creator._id,
        audio: audioData,
        coverImage: coverImageData,
        title, description,
    });

    res.status(201).json({
        status: "success",
        message: "Audio Uploaded",
        data: { audio }
    });
});

exports.getAllMusic = refactory.getAll(Audio, "music");
exports.getAllMyMusic = refactory.getAllMine(Audio, "music");
exports.getOneMusicById = refactory.getOne(Audio, "music");
exports.updateOneMusicById = refactory.updateOne(Audio, "music");
exports.deleteOneMusicById = refactory.updateOne(Audio, "music");

//////////////////////////////////////////////////
// PODCASTS
//////////////////////////////////////////////////

exports.createPodcast = asyncWrapper(async function(req, res) {
    const userId = req.user._id;
    const coverImageFile = req.file;
    const { name, description } = req.body;

    const creator = await Profile.findOne({ user: userId, isCreator: true });
    if(!creator) return res.json({ message: "Only creators can upload audio!" });
    if(!coverImageFile) return res.json({ message: "Podcast cover image not uploaded correctly!" });

    // UPLOAD THE AUDIO COVER IMAGE
    const coverImageFileUpload = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(coverImageFile.path, {
            resource_type: 'image',
            public_id: `podcast-coverimage-${Date.now()}`,
            format: "jpeg",
        }, function(err, result) {
            if (err) reject(new Error(`Error uploading cover image!`));
            else resolve(result.public_id);
        });
    });

    // CROP THE AUDIO COVER IMAGE
    const coverImage_public_id = await coverImageFileUpload;
    const coverImageCroppedUrl = await cloudinary.url(coverImage_public_id, {
        gravity: "auto",
        width: 500,
        height: 500,
        crop: "fill",
        quality: 70
    })
    const coverImageData = { url: coverImageCroppedUrl, public_id: coverImage_public_id }

    const podcast = await Podcast.create({
        creatorProfile: creator._id,
        name, description,
        coverImage: coverImageData,
        episodes: []
    });

    res.status(201).json({
        status: "success",
        message: "Podcast Uploaded",
        data: { podcast }
    });
});


exports.uploadEpisode = asyncWrapper(async function(req, res) {
    const userId = req.user._id;
    const audioFile = req.files.audio[0];
    const { id } = req.params;
    const { title, description } = req.body;

    const creator = await Profile.findOne({ user: userId, isCreator: true });
    const creator_podcast = await Podcast.findOne({ _id: id, creatorProfile: creator._id });
    if(!creator) return res.json({ message: "Only creators can upload audio!" });
    if(!audioFile) return res.json({ message: "Podcast audio file not uploaded correctly!" });
    if(!creator_podcast) return res.json({ message: "Podcast cannot be found!" });

    // UPLOAD THE AUDIO FILE
    const audioFileUpload = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(audioFile.path, {
            resource_type: 'auto',
            public_id: `podcast-episode-${Date.now()}`,
            format: 'mp3'
        }, function(err, result) {
            if (err) reject(new Error(`Error uploading audio!`));
            else resolve({ public_id: result.public_id, url: result.secure_url, duration_in_sec: result.duration });
        });
    });

    const { public_id, url, duration_in_sec } = await audioFileUpload;
    const audioData = { url, public_id, duration_in_sec }
    const episode = { title, description, audio: audioData,}

    await Podcast.findOne(
        { _id: creator_podcast._id },
        { $set: {episodes: [...creator_podcast.episodes, episode]} },
        { runValidators: true, new: true }
    );

    res.status(201).json({
        status: "success",
        message: `Episode: ${FirstCap(title)} Uploaded`,
    });
});


exports.getAllPodcasts = refactory.getAll(Podcast, "podcast");
exports.getAllMyPodcasts = refactory.getAllMine(Podcast, "podcast");
exports.getOnePodcastById = refactory.getOne(Podcast, "podcast");
exports.updateOnePodcastById = refactory.updateOne(Podcast, "podcast");
exports.deleteOnePodcastById = refactory.updateOne(Podcast, "podcast");


//////////////////////////////////////////////////
// COMMENTING POST
//////////////////////////////////////////////////

exports.writeComment = asyncWrapper(async function(req, res) {
    const userId = req.user._id;
    const { itemId, content } = req.body;

    if (!itemId || !content) {
        return res.json({ message: "Invalid request data" });
    }
  
    const userProfile = await Profile.findOne({ user: userId });
    const newComment = await Comment.create({
        itemId,
        content,
        userProfile: userProfile._id,
    });

    const post = await Tube.findOne({ _id: itemId })
    if(post) {
        await Tube.updateOne(
            { _id: post._id },
            { $inc: { comments: 1 } },
            { runValidators: true, new: true }
        )
    }

    res.status(201).json({
        status: "success",
        message: "Commented!",
        data: { comment: newComment }
    })
});


exports.editComment = asyncWrapper(async function(req, res) {
    const userId = req.user._id;
    const { id } = req.params;
    const { content } = req.body;

    const userProfile = await Profile.findOne({ user: userId });
    const comment = await Comment.findOne({ id, userProfile: userProfile._id });
    if(!comment) return res.json({ message: "Cannot find comment" });
    
    const editedComment = await Comment.updateOne(
        { _id: comment._id }, { $set: { content } },
        { runValidators: true, new: true }
    );

    res.status(200).json({
        status: "success",
        message: "Editted!",
        data: { comment: editedComment }
    })
});


exports.deleteComment = asyncWrapper(async function(req, res) {
    const userId = req.user._id;
    const { id } = req.params;

    const userProfile = await Profile.findOne({ user: userId });
    const comment = await Comment.findOne({ id, userProfile: userProfile._id });
    if(!comment) return res.json({ message: "Cannot find comment" });
    await Comment.deleteOne({ _id: comment.id });

    const post = await Tube.findOne({ _id: comment.itemId })
    if(post) {
        await Tube.updateOne(
            { _id: post._id },
            { $inc: { comments: -1 } },
            { runValidators: true, new: true }
        )
    }

    res.status(200).json({
        status: "success",
        message: "Deleted!",
        data: null
    })
});


exports.getItemComments = asyncWrapper(async function(req, res) {
    const { itemId } = req.params;
    const comments = await Comment.find({ itemId });
    res.status(200).json({
        status: "success",
        count: comments.length,
        data: { comments }
    })
});



exports.getAllComments = refactory.getAllPaginated(Comment, "comment");
exports.getCommentById = refactory.getOne(Comment, "comment");



//////////////////////////////////////////////////
// RADIOS
//////////////////////////////////////////////////
// exports.getRadioStations = asyncWrapper(async function(req, res) {
//     const { location } = req.params;

//     const url = `https://nigeria-radio-stations.p.rapidapi.com/?category=${location}`;
//     const options = {
//         method: 'GET',
//         headers: {
//             'x-rapidapi-key': 'd8ca074fe6mshfe41dcf1b853aa9p182ccejsn9f5fff949d43',
//             'x-rapidapi-host': 'nigeria-radio-stations.p.rapidapi.com'
//         }
//     };

// 	const response = await fetch(url, options);
// 	const result = await response.text();
// 	console.log(result);

//     res.status(200).json({
//         status: "success",
//         data: {
//             radio_Stations: result
//         }
//     })

// })

// exports.getRadioStationById = asyncWrapper(async function(req, res) {
//     const { id } = req.params;

//     const url = `https://nigeria-radio-stations.p.rapidapi.com/?id=${id}`;
//     const options = {
//         method: 'GET',
//         headers: {
//             'x-rapidapi-key': 'd8ca074fe6mshfe41dcf1b853aa9p182ccejsn9f5fff949d43',
//             'x-rapidapi-host': 'nigeria-radio-stations.p.rapidapi.com'
//         }
//     };

// 	const response = await fetch(url, options);
// 	const result = await response.text();
// 	console.log(result);

//     res.status(200).json({
//         status: "success",
//         data: {
//             radio_Stations: result
//         }
//     })

// });




//////////////////////////////////////////////////
// LIKING AND UNLINKING
//////////////////////////////////////////////////

// exports.likeTube = asyncWrapper(async function(req, res) {
    
// })

////////////////////////////////////////////////////
//////E-BOOK AND AUDIOBOOKS
////////////////////////////////////////////////////

// Create a audio book
 exports.createAudioBook = asyncWrapper(async function(req, res) {
    const userId = req.user ? req.user._id : req.body.userId;
    const coverImageFile = req.files.coverImage[0];
    const audiobookFile = req.files.audioBook[0];
    const { title, description, author, genre } = req.body;

    if(!userId) {
        return res.status(400).json({ message: "User id is required" });
    }

    const creator = await Profile.findOne({ user: userId, isCreator: true });
    if(!creator) return res.json({ message: "Only creators can upload audio!" });
    if(!coverImageFile || !audiobookFile) return res.json({ message: "Book cover image and audiobook not uploaded correctly!" });

    // UPLOAD THE AUDIO COVER IMAGE
    const coverImageFileUpload = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(coverImageFile.path, {
            resource_type: 'image',
            public_id: `book-coverimage-${Date.now()}`,
            format: "jpeg",
        }, function(err, result) {
            if (err) reject(new Error(`Error uploading cover image!`));
            else resolve(result.public_id);
        });
    });

    // CROP THE AUDIO COVER IMAGE
    const coverImage_public_id = await coverImageFileUpload;
    const coverImageCroppedUrl = await cloudinary.url(coverImage_public_id, {
        gravity: "auto",
        width: 500,
        height: 500,
        crop: "fill",
        quality: 70
    })
    const coverImageData = { url: coverImageCroppedUrl, public_id: coverImage_public_id }

    // UPLOAD THE AUDIO FILE
    const audiobookFileUpload = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(audiobookFile.path, {
            resource_type: 'auto',
            public_id: `audiobook-file-${Date.now()}`,
            format: 'mp3'
        }, function(err, result) {
            if (err) reject(new Error(`Error uploading audiobook!`));
            else resolve({ public_id: result.public_id, url: result.secure_url, duration_in_sec: result.duration });
        });
    });

    const { public_id, url, duration_in_sec } = await audiobookFileUpload;
    const audiobookData = { url, public_id, duration_in_sec }

    const book = await Book.create({
        creatorProfile: creator._id,
        audiobook: audiobookData,
        coverImage: coverImageData,
        title,
        description,
        author,
        genre,
        userId
 });

    res.status(201).json({
        status: "success",
        message: "Book Uploaded",
        data: { book }
    });
});


// Create ebook
exports.createEBook = asyncWrapper(async function(req, res) {
    const userId = req.user ? req.user._id : req.body.userId;
    const coverImageFile = req.files.coverImage?.[0];
    const ebookFile = req.files.pdf[0];
    const { title, description, author, genre } = req.body;

    if(!userId) return res.status(401).json({ message: "User id is required" });

    const creator = await Profile.findOne({ user: userId, isCreator: true });
    if(!creator) return res.json({ message: "Only creators can upload Ebook!" });
    if(!coverImageFile || !ebookFile) return res.json({ message: "Book cover image and ebook not uploaded correctly!" });

    // UPLOAD THE EBOOK COVER IMAGE
    const coverImageFileUpload = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(coverImageFile.path, {
            resource_type: 'image',
            public_id: `book-coverimage-${Date.now()}`, 
          
        }, function(err, result) {
            if (err) reject(new Error(`Error uploading cover image!`));
            else resolve(result.public_id);
        });
    });

    // CROP THE EBOOK COVER IMAGE
    const coverImage_public_id = await coverImageFileUpload;
    const coverImageCroppedUrl = await cloudinary.url(coverImage_public_id, {
        gravity: "auto",
        width: 500,
        height: 500,
        crop: "fill",
        quality: 70
    })
    const coverImageData = { url: coverImageCroppedUrl, public_id: coverImage_public_id }

    // UPLOAD THE AUDIO FILE
    const ebookFileUpload = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(ebookFile.path, {
            resource_type: 'auto',
            public_id: `ebook-file-${Date.now()}`,
        }, function(err, result) {
            if (err) reject(new Error(`Error uploading ebook!`));
            else resolve({ public_id: result.public_id, url: result.secure_url });
        });
    });

    const { public_id, url } = await ebookFileUpload;
    const ebookData = { url, public_id }

    const book = await Book.create({
        creatorProfile: creator._id,
        ebook: ebookData,
        coverImage: coverImageData,
        title,
        description,
        author,
        genre,
        userId
 });

    res.status(201).json({
        status: "success",
        message: "Book Uploaded",
        data: { book }
    });
});

// Get all books
exports.getAllBooks = asyncWrapper(async function(req, res) {
    const books = await Book.find();
    res.status(200).json({
        status: "success",
        data: { books }
    });
});

// Get one book by id
exports.getOneBookById = asyncWrapper(async function(req, res) {
    const { id } = req.params;
    const book = await Book.findOne({ _id: id });  
    if (!book) {
        return res.status(404).json({
            status: "fail",
            message: "Book not found",
        });
    }
 
    res.status(200).json({
        status: "success",
        data: { book }
    });     
});

// Update a book(only the creator can update)   
exports.updateBook = asyncWrapper(async function(req, res) {
    const userId = req.user._id;
    const { id } = req.params;
    const { title, author, description, genre } = req.body;

    const creator = await Profile.findOne({ user: userId, isCreator: true });
    if(!creator) return res.json({ message: "Only creators can update book" });
    const book = await Book.findOne({ _id: id, creatorProfile: creator._id });
    if(!book) return res.json({ message: "Cannot find book" });

    const updatedBook = await Book.updateOne(
        { _id: book._id }, { $set: { title, author, description, genre } },
        { runValidators: true, new: true }
    );

    res.status(200).json({
        status: "success",
        message: "Book Updated",
        data: { book: updatedBook }
    });
});
//delete a book
exports.deleteBook = asyncWrapper(async function(req, res) {
    const userId = req.user._id;
    const { id } = req.params;

    const creator = await Profile.findOne({ user: userId, isCreator: true });
    if(!creator) return res.json({ message: "Only creators can delete book" });
    const book = await Book.findOne({ _id: id, creatorProfile: creator._id });
    if(!book) return res.json({ message: "Cannot find book" });

    await Book.deleteOne({ _id: book.id });

    res.status(200).json({
        status: "success",
        message: "Book Deleted",
        data: null
    });
});

exports.getAllBooks = refactory.getAll(Book, "book");
exports.getAllMyBooks = refactory.getAllMine(Book, "book");
exports.getOneBookById = refactory.getOne(Book, "book");
exports.updateOneBookById = refactory.updateOne(Book, "book");
exports.deleteOneBookById = refactory.updateOne(Book, "book");
