const multer = require('multer');
// const sharp = require('sharp');


//////////////////////////////////////////////////
//// MULTER STORAGE ////
//////////////////////////////////////////////////
const multerStorage = multer.diskStorage({});


//////////////////////////////////////////////////
//// MULTER FILTER ////
//////////////////////////////////////////////////
const multerFilter = (req, file, cb) => {
    try {
        // if (file.mimetype.startsWith('image') || file.mimetype.startsWith("video") || file.mimetype.startsWith("audio") || file.mimetype.startsWith("thumbnail")) {
        if(file) {
            cb(null, true);
        } else {
            throw new Error('Not a Vaild file! Please upload only accepted files');
        }
    } catch (error) {
        cb(error, false);
    }
}


//////////////////////////////////////////////////
//// MULTER UPLOAD ////
//////////////////////////////////////////////////
const upload = multer({
    storage: multerStorage,
    fileFilter: multerFilter,
});


//////////////////////////////////////////////////
//// MULTER UPLOADS ////
//////////////////////////////////////////////////
exports.uploadSingleImage = upload.single('image');

exports.uploadVideo = upload.fields([{ name: 'video', maxCount: 1 }, { name: 'thumbnail', maxCount: 1 }]);
exports.uploadAudio = upload.fields([{ name: 'audio', maxCount: 1 }, { name: 'coverImage', maxCount: 1 }]);


//////////////////////////////////////////////////
//// SHARP RESIZE SINGLE USER IMAGE ////
//////////////////////////////////////////////////
exports.resizeSingleUserImage = async function (req, _, next) {
    if(!req.file) return next();
    const id = req.user._id;

    try {
        req.file.filename = `user-${id}-${Date.now()}.jpeg`;

        await sharp(req.file.buffer)
            .resize(350, 350)
            .toFormat('jpeg')
            .jpeg({ quality: 80 })
            .toFile(`public/assets/users/${req.file.filename}`);
        next();

    } catch(err) {
        next(err);
    }
};