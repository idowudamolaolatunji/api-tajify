const multer = require('multer');
// const sharp = require('sharp');


//////////////////////////////////////////////////
//// MULTER STORAGE ////
//////////////////////////////////////////////////
const multerStorage = multer.memoryStorage();


//////////////////////////////////////////////////
//// MULTER FILTER ////
//////////////////////////////////////////////////
const multerFilter = (req, file, cb) => {
    try {
        if (file.mimetype.startsWith('image')) {
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
    limits: { fieldSize: 1024 * 1024 * 5 }
});


//////////////////////////////////////////////////
//// MULTER UPLOADS ////
//////////////////////////////////////////////////
exports.uploadSingleImage = upload.single('image');
exports.uploadMultipleImage = upload.array('images', 4);

