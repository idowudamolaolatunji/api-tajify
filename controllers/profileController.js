const UserProfile = require("../models/userProfilesModel");
const { asyncWrapper } = require("../utils/handlers");
const refactory = require("./handleRefactory");


//////////////////////////////////////////////////
// PROFILE IMPLEMENTATIONS
//////////////////////////////////////////////////
// const profileParameter = [UserProfile, "Profile"]


exports.becomeCreator = asyncWrapper(async function(req, res) {
    const userId = req.user._id;
    const already_a_Creator = await UserProfile.findOne({ creator: userId })

    if(already_a_Creator) return res.json({
        message: "Cannot process request, You are already a creator!"
    })

    const createdProfile = await UserProfile.create({ creator: userId });

    res.status(201).json({
        status: "success",
        message: "Profile Created!",
        data: {
            profile: createdProfile
        }
    })
});


exports.getAllProfiles = refactory.getAll(UserProfile, "Profile")

exports.getMyProfile = asyncWrapper(async function(req, res) {
    const creatorId = req.user._id;

    const profile = await UserProfile.findOne({ creator: creatorId });
    if(!profile) return res.json({
        message: "You are not yet a creator!"
    });

    res.status(201).json({
        status: "success",
        data: { profile }
    })
});


exports.updateProfile = asyncWrapper(async function(req, res) {
    const creatorId = req.user._id;

    const profile = await UserProfile.findOne({ creator: creatorId });
    if(!profile) return res.json({
        message: "You are not yet a creator!"
    });

    res.status(201).json({
        status: "success",
        message: "Profile Updated!",
        data: {
            profile
        }
    })
});