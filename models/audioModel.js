const mongoose = require("mongoose");
const slugify = require("slugify");


const audioSchema = new mongoose.Schema({
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: mongoose.Schema.Types.Mixed,
        required: true
    },
    slug: String,
    streams: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    audioUrl: { type: String, default: "" },
    coverImageUrl: { type: String, default: "" },
}, {
    timestamps: true
});



audioSchema.pre("save", function(next) {
    if(this.isNew || this.isModified("title")) {
        const slug = slugify(this.title, { lower: true, replacement: "-" });
        this.slug = slug;
    }

    next();
});

audioSchema.pre(/^find/, function(next) {
    this.populate({
        path: "creator",
        select: "_id username",
    });

    next();
});


const Audio = mongoose.model("Audio", audioSchema);
module.exports = Audio;