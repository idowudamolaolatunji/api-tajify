
const Tube = require("../models/tubesModel");
const { asyncWrapper } = require("../utils/handlers");
const refactory = require("./handleRefactory");
const cloudinary = require("../utils/cloudinary");
const sharp = require("sharp");
////////////////////////////////////////////////////
////////////////////////////////////////////////////

const refactoryParameter = [Tube, "tube"]

exports.getAllTubes = refactory.getAll(...refactoryParameter);

exports.getAllMyTubes = refactory.getAllMine(...refactoryParameter);
exports.getOneTubeById = refactory.getOne(...refactoryParameter);
exports.updateOneTubeById = refactory.updateOne(...refactoryParameter);
exports.deleteOneTubeById = refactory.updateOne(...refactoryParameter);


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

exports.createTube = refactory.createOne(...refactoryParameter, "creator");


exports.uploadTubeVideo = asyncWrapper(async function(req, res) {
    const { id } = req.params;

    const videoFile = req.files.video[0];
    const thumbnailFile = req.files.thumbnail[0];
    if(!videoFile || !thumbnailFile) return res.json({ message: "File not uploaded properly" })

    const thumbnailSize = req.body.type == "tube-short" ? [1080, 1950] : [720, 1280];
    const thumbnailBuffer = await sharp(thumbnailFile.buffer)
        .resize(...thumbnailSize)
        .toFormat('jpeg')
        .jpeg({ quality: 75 })
        .toBuffer()
    ;

    const thumbnailUploadResult = await cloudinary.uploader.upload(thumbnailBuffer, {
        resource_type: 'image'
    });

    const videoUploadResult = await cloudinary.uploader.upload(videoFile.path, {
      resource_type: 'video'
    });

    const videoUrl = videoUploadResult.secure_url;
    const thumbnailUrl = thumbnailUploadResult.secure_url;

    const tube = await Tube.findOneAndUpdate({ id }, 
        { thumbnailUrl, videoFIleUrl: videoUrl  },
        { runValidators: true, new: true }
    );

    res.status(200).json({
        status: "success",
        message: "Media Content Uploaded",
        data: {
            tube
        }
    })
});