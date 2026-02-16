/* eslint-disable node/no-missing-require */
// eslint-disable-next-line import/no-unresolved
const { v4: uuidv4 } = require('uuid');
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const factor = require('./mianController');
const imageUpload = require('../middlewares/imageUpload');
const Review = require('../models/review');
const ApiError = require('../utils/apiError');

exports.sharpForImageProccessing = asyncHandler(async (req, res, next) => {
    if (req.files && req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (img, index) => {
                const fileName = `review-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
                await sharp(img.buffer)
                    .resize(2000, 1333)
                    .toFormat('jpeg')
                    .jpeg({ quality: 60 })
                    .toFile(`uploads/reviews/${fileName}`);
                req.body.images.push(fileName);
            })
        );
    }
    next();
});

exports.reviewFileUploading = imageUpload.uploadOneAndMore([
    {
        name: 'images',
        maxCount: 3,
    },
]);

exports.setUserIdToBody = (req, res, next) => {
    if (req.body.user && req.body.user.toString() !== req.user._id.toString()) {
        return next(new ApiError('unauthorized access', 403));
    }
    req.body.user = req.user._id;
    next();
};

// nested routes
// @route   GET /Api/v1/products/:productId/reviews
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.productId) filterObject = { product: req.params.productId };
    req.filterObj = filterObject;
    next();
};

// for creating nested route
exports.addproductIdAndUserIdToBody = (req, res, next) => {
    if (!req.body.product) {
        req.body.product = req.params.productId;
    }
    if (!req.body.user) {
        req.body.user = req.user._id;
    }
    next();
};

// @desc    create Review
// @route   POST /Api/v1/reviews
// @access  private
exports.addReview = factor.addOne(Review);

// @desc    get reviews
// @route   GET /Api/v1/reviews
// @access  public
exports.getReviews = factor.getAll(Review);

// @desc    get Review
// @route   GET /Api/v1/reviews/:id
// @access  public
exports.getReview = factor.getOne(Review);

// @desc    update Review
// @route   PUT /Api/v1/reviews/:id
// @access  public
exports.updateReview = factor.updateOne(Review);

// @desc    delete Review
// @route   DELETE /Api/v1/reviews/:id
// @access  public
exports.deleteReview = factor.deleteOne(Review);
