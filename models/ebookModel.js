const mongoose = require('mongoose');
const slugify = require('slugify');

const eBookSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },
        specification: {
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
                type: [String], 
                trim: true,
            },
        },
        creatorProfile: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Profile',
        },
        coverImage: {
            url: { type: String, required: true },
            public_id: String,
        },
        url: {
            fileUrl: {
                type: String,
                required: true,
                trim: true,
            }, 
            fileType: {
                type: String,
                trim: true,
            },
        },
        slug: {
            type: String,
            unique: true,
        },
        likes: {
            type: Number,
            default: 0,
        },
    },
    { timestamps: true }
);

eBookSchema.pre('save', function (next) {
    if (this.isNew || this.isModified('title')) {
        this.slug = slugify(this.title, { lower: true });
    }
    next();
});

// Auto-populate creatorProfile when querying
eBookSchema.pre(/^find/, function (next) {
    this.populate({ path: 'creatorProfile', select: '_id username profileName' });
    next();
});

const eBook = mongoose.model('eBook', eBookSchema);
module.exports = eBook;
