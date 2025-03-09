
const Tube = require("../models/tubesModel");
const { asyncWrapper } = require("../utils/handlers");
const refactory = require("./handleRefactory");
const cloudinary = require("../utils/cloudinary");
const Audio = require("../models/audioModel");
const Comment = require("../models/commentModel");
const Profile = require("../models/profileModel")
const Podcast = require("../models/podcastModel");
const { FirstCap } = require("../utils/helpers");
const Book = require("../models/bookModel");
////////////////////////////////////////////////////
////////////////////////////////////////////////////



//////////////////////////////////////////////////
// VIDEOS AND TUBES
//////////////////////////////////////////////////
exports.getAllTubes = refactory.getAll(Tube, "tube");
exports.getAllMyTubes = refactory.getAllMine(Tube, "tube", "creatorProfile");
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
exports.getAllMyMusic = refactory.getAllMine(Audio, "music", "creatorProfile");
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
exports.getOnePodcastById = refactory.getOne(Podcast, "podcast");
exports.updateOnePodcastById = refactory.updateOne(Podcast, "podcast");
exports.deleteOnePodcastById = refactory.deleteOne(Podcast, "podcast");
exports.getAllMyPodcasts = refactory.getAllMine(Podcast, "podcast", "creatorProfile");


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
// LIKING AND UNLINKING
//////////////////////////////////////////////////

exports.likeTube = asyncWrapper(async function(req, res) {
    
})








//////////////////////////////////////////////////
// E-BOOKS / BOOKS
//////////////////////////////////////////////////

exports.getAllBooks = refactory.getAll(Book, "book",);
exports.getbookById = refactory.getOne(Book, "book")

exports.getAllMyBooks = refactory.getAllMine(Book, "book", "creatorProfile");

// Create book
exports.createBook = asyncWrapper(async (req, res) => {
    const userId = req.user._id;
    const coverImageFile = req.files.coverImage[0];
    const bookFile = req.files.book[0];
    const { description, author, genre } = req.body;

    const creator = await Profile.findOne({ user: userId, isCreator: true });
    if (!creator) return res.json({ message: 'Only creators can upload an book!' });

    if (!coverImageFile || !bookFile) {
        return res.json({ message: 'Book cover image and book file not uploaded correctly!' });
    }

    // Upload Cover Image
    const coverImageUpload = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(coverImageFile.path, {
            resource_type: 'image',
            public_id: `book-cover-${Date.now()}`
        }, function (err, result) {
                if (err) reject(new Error('Error uploading cover image!'));
                else resolve(result);
            }
        );
    });

    const coverImageResult = await coverImageUpload;
    const coverImageCroppedUrl = cloudinary.url(coverImageResult.public_id, {
        gravity: 'auto',
        width: 500,
        height: 500,
        crop: 'fill',
        quality: 70,
    });

    const coverImageData = {
        url: coverImageCroppedUrl,
        public_id: coverImageResult.public_id
    };

    // Upload book File
    const bookFileUpload = new Promise((resolve, reject) => {
        cloudinary.uploader.upload(bookFile.path, {
            resource_type: 'raw',
            public_id: `book-file-${Date.now()}`
        }, function (err, result) {
                if (err) reject(new Error('Error uploading book!'));
                else resolve(result);
            }
        );
    });

    const bookResult = await bookFileUpload;
    const bookData = {
        url: bookResult.secure_url,
        public_id: bookResult.public_id,
        fileType: 'pdf',
    };
        
    const book = await Book.create({
        creatorProfile: creator._id,
        coverImage: coverImageData,
        file: bookData,
        specification: {
            description,
            author,
            genre: JSON.parse(genre)
        },
    });

    res.status(201).json({
        status: 'success',
        message: 'Book uploaded successfully',
        data: { book },
    });
});

// Update a book(only the creator can update)   
exports.updateBook = asyncWrapper(async function (req, res) {
    const userId = req.user._id;
    const { id } = req.params;
    const { title, author, description, genre } = req.body;

    // Find the creator's profile
    const creator = await Profile.findOne({ user: userId, isCreator: true });
    if (!creator) {
        return res.status(403).json({ message: "Only creators can update books" });
    }

    console.log("Looking for book with ID:", id);
    console.log("Expecting creatorProfile:", creator._id);

    // Find the book
    const book = await Book.findById(id);
    if (!book) {
        return res.status(404).json({ message: "Cannot find book" });
    }

    console.log("Found book:", book);
    console.log("Book's creatorProfile:", book.creatorProfile);

    // Check if the user is the creator of the book
    if (!book.creatorProfile.equals(creator._id)) {
        return res.status(403).json({ message: "You are not the creator of this book" });
    }

    // Update the book
    book.title = title || book.title;
    book.specification.author = author || book.specification.author;
    book.specification.description = description || book.specification.description;
    book.specification.genre = genre || book.specification.genre;
    
    await book.save();

    res.status(200).json({
        status: "success",
        message: "Book Updated",
        data: { book }
    });
});

//delete a book
exports.deletbook = asyncWrapper(async function(req, res) {
    const userId = req.user._id;
    const { id } = req.params;

    const creator = await Profile.findOne({ user: userId, isCreator: true });
    if(!creator) return res.json({ message: "Only creators can delete book" });
    const book = await Book.findOne({ _id: id, creatorProfile: creator._id });
    if(!book) return res.json({ message: "Cannot find book" });

    await book.deleteOne({ _id: book._id });

    res.status(200).json({
        status: "success",
        message: "Book Deleted",
        data: null
    });
});




//////////////////////////////////////////////////
// BLOG / ARTICLE
//////////////////////////////////////////////////

// exports.createBlogPost = refactory.createOneCreator();