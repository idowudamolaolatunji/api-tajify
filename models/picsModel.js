const mongoose = require("mongoose");


const picSchema = new mongoose.Schema({
    creatorProfile: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    preview: {
        url: { type: String, required: true },
        public_id: String
    },
    width: Number,
    height: Number,
    size: Number,
    views: {
        type: Number,
        default: 0
    },
    downloads: {
        type: Number,
        default: 0
    },
    likes: {
        type: Number,
        default: 0
    },
    
}, {
    timestamps: true
});



const Pic = mongoose.model("Pic", picSchema);
module.exports = Pic;