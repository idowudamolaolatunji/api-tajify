const mongoose = require('mongoose');
const slugify = require('slugify');

const eBookSchema = new mongoose.Schema({
    title: {
         type: String,
         required: true,
          trim: true
         },
    author: {
         type: String,
          required: true,
           trim: true
         },
    description: {
         type: String,
          trim: true
         },
    publishedYear: {
         type: Number
         },
    genre: {
         type: String,
          trim: true
         },
    userId: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
         required: true
         },
    creatorProfile: {
         type: mongoose.Schema.Types.ObjectId,
          ref: 'Profile'
         },
    coverImage: {
        url: { type: String, required: true },
        public_id: String,
    },
    fileUrl: {
         type: String,
          required: true,
           trim: true
         }, // eBook file link (PDF, EPUB)
    fileType: {
         type: String,
          trim: true
         }, // Example: 'pdf', 'epub'
    slug: {
         type: String,
          unique: true
         },
    likes: { 
        type: Number,
         default: 0 
        },
}, { timestamps: true });

eBookSchema.pre("save", function(next) {
    if (this.isNew || this.isModified("title")) {
        this.slug = slugify(this.title, { lower: true });
    }
    next();
});

// Auto-populate creatorProfile and userId when querying
eBookSchema.pre(/^find/, function(next) {
    this.populate({ path: "creatorProfile", select: "_id username profileName" })
        .populate({ path: "userId", select: "_id username email" });
    next();
});

const eBook = mongoose.model('eBook', eBookSchema);
module.exports = eBook;
