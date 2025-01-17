const Notification = require("../models/notificationModel");
const UserProfile = require("../models/userProfilesModel");
const { asyncWrapper } = require("../utils/handlers");
const { filterObj, formatDate, countNum } = require("../utils/helpers");
const refactory = require("./handleRefactory");



//////////////////////////////////////////////////
// PROFILE IMPLEMENTATIONS
//////////////////////////////////////////////////
exports.becomeCreator = asyncWrapper(async function(req, res) {
    const userId = req.user._id;
    const already_a_Creator = await UserProfile.findOne({ user: userId })

    if(already_a_Creator.isCreator) return res.json({
        message: "Cannot process request, You are already a creator!"
    })

    const createdProfile = await UserProfile.updateOne(
        { user: userId },
        { $set: { isCreator: true } },
        { runValidators: true, new: true }
    );

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

    const profile = await UserProfile.findOne({ user: creatorId });
    if(!profile.isCreator) return res.json({ message: "You are not yet a creator!" });

    res.status(201).json({
        status: "success",
        data: { profile }
    })
});

exports.updateProfile = asyncWrapper(async function(req, res) {
    const creatorId = req.user._id;

    const profile = await UserProfile.findOne({ user: creatorId });
    if(!profile.isCreator) return res.json({
        message: "You are not yet a creator!"
    });

    const filterArray = ["bio", "website", "country", "country", "city", "zipCode", "interests"];
    const filteredBody = filterObj(req.body, ...filterArray);

    const updatedProfile = await UserProfile.updateOne(
        { user: creatorId },
        { $set: filteredBody },
        { runValidators: true, new: true }
    );

    res.status(201).json({
        status: "success",
        message: "Profile Updated!",
        data: {
            profile: updatedProfile
        }
    })
});


//////////////////////////////////////////////////
// FOLLOW IMPLEMENTATIONS
//////////////////////////////////////////////////
exports.followCreator = asyncWrapper(async function(req, res) {
    const currentUserId = req.user._id;
    const profileId = req.params.id;

    const currentUserProfile = await UserProfile.findOne({ user: currentUserId });
    const profileToFollow = await UserProfile.findOne({ _id: profileId, isCreator: true });
    if(!profileToFollow) return res.json({ message: "Only creators can be followed" });

    if (currentUserProfile.following.includes(profileToFollow._id)) {
        return res.json({ message: "Already following creator" });
    }

    profileToFollow.followers.push(currentUserProfile._id);
    await profileToFollow.save({ validateBeforeSave: false });

    currentUserProfile.following.push(profileToFollow._id);
    await currentUserProfile.save({ validateBeforeSave: false });

    await Notification.create({
        userId: profileToFollow.user,
        title: `@${currentUserProfile.username}`,
        content: `started following you ${formatDate}`,
        extraPayload: { identifier: "Follower Id", value: currentUserProfile._id }
    });

    res.status(200).json({
        status: 'success',
        message: "Follow request sent!",
    });
});

exports.followBackCreator = asyncWrapper(async function(req, res) {
    const currentUserId = req.user._id;
    const profileId = req.params.id;

    const currentUserProfile = await UserProfile.findOne({ user: currentUserId });
    const profileToFollowBack = await UserProfile.findOne({ user: profileId, isCreator: true });
    if(!profileToFollowBack) return res.json({ message: "Only creators can be followed back" });

    if(currentUserProfile.following.includes(profileToFollowBack._id)) {
        return res.json({ message: "Already following creator" });
    }

    profileToFollowBack.followers.push(currentUserProfile._id);
    await profileToFollowBack.save({ validateBeforeSave: false });

    currentUserProfile.following.push(profileToFollowBack._id);
    await currentUserProfile.save({ validateBeforeSave: false });

    await Notification.create({
        user: profileToFollowBack._id,
        title: `@${currentUserProfile.username}`,
        content: `followed you back ${formatDate}`,
    });

    res.status(200).json({
        status: 'success',
        message: "Follow request sent!",
    });
});

exports.unfollowCreator = asyncWrapper(async function(req, res) {
    const currentUserId = req.user._id;
    const profileId = req.params.id;

    const currentUserProfile = await UserProfile.findOne({ user: currentUserId });
    const profileToUnfollow = await UserProfile.findOne({ user: profileId, isCreator: true });

    if(!profileToUnfollow || !currentUserProfile.following.includes(profileToUnfollow.id)) {
        return res.json({ message: "Only unfollow creator you already follow" });
    }

    profileToUnfollow.followers.filter((id) => id !== currentUserProfile._id);
    await profileToUnfollow.save({ validateBeforeSave: false });

    currentUserProfile.following.filter((id) => id !== profileToUnfollow._id);
    await currentUserProfile.save({ validateBeforeSave: false });

    res.status(200).json({
        status: 'success',
        message: "Follow request sent!",
    });
})

exports.getMyFollowers = asyncWrapper(async function(req, res) {
    const creatorId = req.user.id;
    const profile = await UserProfile.findOne({ user: creatorId, isCreator: true });
    if(!profile) return res.json({ message: "You are not a creator" });

    const followers = [...profile.followers];
    res.status(200).json({
        status: "success",
        count: countNum(followers.length),
        data: { followers }
    })
});

exports.getMyFollowings = asyncWrapper(async function(req, res) {
    const profile = await UserProfile.findOne({ user: req.user.id });
    const followings = [...profile.following];

    res.status(200).json({
        status: "success",
        count: countNum(followings.length),
        data: { followings }
    })
});