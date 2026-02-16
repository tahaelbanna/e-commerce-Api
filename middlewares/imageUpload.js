const multer = require('multer');
const ApiError = require('../utils/apiError');

const multerOptions = () => {
    const memoryStorage = multer.memoryStorage();
    const multerFilter = function (req, file, cb) {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb(new ApiError('Only Images allowed', 400), false);
        }
    };
    const upload = multer({
        storage: memoryStorage,
        limits: { fileSize: 2 * 1024 * 1024 }, // 2MB max
        fileFilter: multerFilter,
    });
    return upload;
};

exports.uploadOne = (fieldName) => multerOptions().single(fieldName);

exports.uploadOneAndMore = (arrayOfFields) =>
    multerOptions().fields(arrayOfFields);
