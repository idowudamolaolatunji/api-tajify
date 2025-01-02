const mongoose = require("mongoose");
const slugify = require("slugify");


const tubesSchema = new mongoose.Schema({
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
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    shares: { type: Number, default: 0 },
    saves: { type: Number, default: 0 },
    comments: { type: Number, default: 0 },
    type: {
        type: String,
        enum: ["tube-short", "tube-max", "tube-prime"],
        required: true,
    },
    hashTags: [String],
    videoUrl: { type: String, default: "" },
    thumbnailUrl: { type: String, default: "" },
    slug: String,
    lastModified: { type: Date, default: null },
}, {
    timestamps: true,
});



tubesSchema.pre("save", function(next) {
    if(this.isNew || this.isModified("title")) {
        const slug = slugify(this.title, { lower: true, replacement: "-" });
        this.slug = slug;
    }

    next();
});


tubesSchema.pre("save", function(next) {
    if(this.createdAt == this.updatedAt) {
        this.lastModified = null;
    } else {
        this.lastModified = this.updatedAt
    }

    next();
});


tubesSchema.pre(/^find/, function(next) {
    this.populate({
        path: "creator",
        select: "_id username",
    });

    next();
})


const Tube = mongoose.model("Tube", tubesSchema);
module.exports = Tube;