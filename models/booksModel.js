const mongoose = require('mongoose');
const { Stream } = require('nodemailer/lib/xoauth2');
const slugify = require('slugify');

const bookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
    },
    author: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    publishedYear: {
        type: Number,
    },
    genre: {
        type: String,
        trim: true,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    coverImage: {
        url: { type: String, required: true },
        public_id: String,
    },
    audiobook: {
        fileUrl: {
            type: String, 
            trim: true,
        },
        duration: {
            type: Number,
        },
        fileType: {
            type: String, 
            trim: true,
        },
        narrator: {
            type: String,
            trim: true,
        },
        slug: String,
        likes: { type: Number, default: 0 },
        Stream : { type: Number, default: 0 },
    },
}, {
    timestamps: true,
});

bookSchema.pre("save", function(next) {
    if (this.isNew || this.isModified("title")) {
        this.audiobook.slug = slugify(this.title, { lower: true, replacement: "-" });
    }
    next();
});


bookSchema.pre(/^find/, function(next) {
    this.populate({
        path: "creatorProfile",
        select: "_id username",
    });

    next();
});

const Book = mongoose.model('Book', bookSchema);
module.exports = Book;




