const mongoose = require("mongoose");


const userProfileSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    bio: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    website: String,
    location: {
        country: String,
        state: String,
        city: String,
        zipCode: String,
    },
    accountType: {
        type: String,
        enum: [""]
    },
    postCount: { type: Number, default: 0 },
    followerCount: { type: Number, default: 0 },
    followingCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    interests: [String],
    skills: [String],
}, {
    timestamps: true,
})