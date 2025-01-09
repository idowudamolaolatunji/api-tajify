const mongoose = require("mongoose");


const userProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    username: String,
    profileImage: { type: String, default: "" },
    coverPhoto: { type: String, default: "" },
    bio: { type: mongoose.Schema.Types.Mixed },
    website: String,
    country: String,
    state: String,
    city: String,
    zipCode: String,
    isCreator: { type: Boolean, default: false },
    followers: [{ type: mongoose.Schema.Types.ObjectId }],
	following: [{ type: mongoose.Schema.Types.ObjectId }],
    postCount: { type: Number, default: 0 },
    interests: [String],
}, {
    timestamps: true,
});


const UserProfile = mongoose.model("UserProfile", userProfileSchema);
module.exports = UserProfile;