
const Tube = require("../models/tubesModel");
const { asyncWrapper } = require("../utils/handlers");
const refactory = require("./handleRefactory");
const cloudinary = require("../utils/cloudinary");
const sharp = require("sharp");
const Audio = require("../models/audioModel");
const Comment = require("../models/commentModel");
const UserProfile = require("../models/userProfilesModel");
////////////////////////////////////////////////////
////////////////////////////////////////////////////



//////////////////////////////////////////////////
// VIDEOS AND TUBES
//////////////////////////////////////////////////
const tubeParameter = [Tube, "tube"]

exports.getAllTubes = refactory.getAll(...tubeParameter);
exports.getAllMyTubes = refactory.getAllMine(...tubeParameter);
exports.getOneTubeById = refactory.getOne(...tubeParameter);
exports.updateOneTubeById = refactory.updateOne(...tubeParameter);
exports.deleteOneTubeById = refactory.updateOne(...tubeParameter);

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

    if(!tubeFile || !thumbnailFile) return res.json({ message: "Tube video and thumbnail are required!" })

    const thumbnailSize = req.body.type == "tube-short" ? [720, 1280] : [1080, 1950];
    const thumbnailBuffer = sharp(thumbnailFile.path)
        .resize(...thumbnailSize)
        .toFormat('jpeg')
        .jpeg({ quality: 70 })
    ;

    const thumbnailPath = thumbnailBuffer.options.input.file;
    const thumbnailUploadResult = await cloudinary.uploader.upload(thumbnailPath, {
        resource_type: 'image',
        public_id: Date.now()
    });

    if(!thumbnailUploadResult) {
        console.log(err)
        return res.status(500).json({ message: "Error Uploading Thumbnail" })
    }

    const videoUploadResult = await cloudinary.uploader.upload(tubeFile.path, {
        resource_type: 'video',
        public_id: req.body.title
    });

    if(!videoUploadResult) {
        console.log(err)
        return res.status(500).json({ message: "Error Uploading Video" })
    }

    const thumbnailUrl = thumbnailUploadResult.secure_url;
    const videoUrl = videoUploadResult.secure_url;

    const tube = await Tube.create({
        creator: userId,
        thumbnailUrl, videoUrl,
        ...req.body,
    });

    res.status(200).json({
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

    if(!audioFile) return res.json({ message: "Music file not uploaded correctly!" })

    const audioUploadResult = await cloudinary.uploader.upload(audioFile.path, {
        resource_type: 'video',
        public_id: req.body.title
    });

    if(!audioUploadResult) {
        return res.status(500).json({ message: "Error Uploading Audio" })
    }

    let coverImageUploadResult = "";
    if(coverImageFile) {
        coverImageUploadResult = await cloudinary.uploader.upload(coverImageFile.path, {
            resource_type: 'image',
            public_id: Date.now()
        });
    
        if(!coverImageUploadResult) {
            return res.status(500).json({ message: "Error Uploading Cover Image" })
        }
    }

    const audioUrl = audioUploadResult.secure_url;
    const coverImageUrl = coverImageUploadResult.secure_url;

    const audio = await Audio.create({
        creator: userId,
        audioUrl, coverImageUrl,
        ...req.body,
    });

    res.status(201).json({
        status: "success",
        message: "Audio Uploaded",
        data: { audio }
    });
});







//////////////////////////////////////////////////
// PODCASTS AND RADIOS
//////////////////////////////////////////////////
exports.getRadioStations = asyncWrapper(async function(req, res) {
    const { location } = req.params;

    const url = `https://nigeria-radio-stations.p.rapidapi.com/?category=${location}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'd8ca074fe6mshfe41dcf1b853aa9p182ccejsn9f5fff949d43',
            'x-rapidapi-host': 'nigeria-radio-stations.p.rapidapi.com'
        }
    };

	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);

    res.status(200).json({
        status: "success",
        data: {
            radio_Stations: result
        }
    })

})


exports.getRadioStationById = asyncWrapper(async function(req, res) {
    const { id } = req.params;

    const url = `https://nigeria-radio-stations.p.rapidapi.com/?id=${id}`;
    const options = {
        method: 'GET',
        headers: {
            'x-rapidapi-key': 'd8ca074fe6mshfe41dcf1b853aa9p182ccejsn9f5fff949d43',
            'x-rapidapi-host': 'nigeria-radio-stations.p.rapidapi.com'
        }
    };

	const response = await fetch(url, options);
	const result = await response.text();
	console.log(result);

    res.status(200).json({
        status: "success",
        data: {
            radio_Stations: result
        }
    })

});




//////////////////////////////////////////////////
// COMMENTING AND LIKING POST
//////////////////////////////////////////////////

exports.writeComment = asyncWrapper(async function(req, res) {
    const userId = req.user._id;
    const { itemId, content } = req.body;

    if (!itemId || !content) {
        return res.json({ message: "Invalid request data" });
    }
  
    const userProfile = await UserProfile.findOne({ user: userId });
    const newComment = await Comment.create({
        userId,
        itemId,
        content,
        userProfile,
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

    const comment = await Comment.findOne({ id, userId });
    if(!comment) return res.json({ message: "Cannot find comment" });
    
    const editedComment = await Comment.updateOne(
        { _id: comment.id }, { $set: { content } },
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

    const comment = await Comment.findOne({ id, userId });
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