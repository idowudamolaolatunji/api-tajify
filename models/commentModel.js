const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    userProfile: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'UserProfile',
        required: true,
    },
    itemId: {
        type: mongoose.SchemaTypes.ObjectId,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

commentSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'userProfile',
        select: '_id username profileImage'
    });

    next();
})

const Comment = mongoose.model('Comment', commentSchema);
module.exports = Comment;
