const slugify = require('slugify');
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validator');
const Product = require('../../models/product');
const Review = require('../../models/review');

exports.checkGetReview = [
    check('id').isMongoId().withMessage('Invalid Review id format'),
    validatorMiddleware,
];

exports.checkUpdateReview = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Review id format')
        .custom(async (val, { req }) => {
            const review = await Review.findById(val);
            if (!review) {
                throw new Error(`no such id for id: ${val}`);
            }
            if (review.user._id.toString() !== req.user._id.toString()) {
                throw new Error(
                    `you are unauthorized for editing this review!`
                );
            }
        }),
    validatorMiddleware,
];

exports.checkDeleteReview = [
    check('id')
        .isMongoId()
        .withMessage('Invalid Review id format')
        .custom(async (val, { req }) => {
            const review = await Review.findById(val);
            if (!review) {
                throw new Error(`no such id for id: ${val}`);
            }
            console.log(review.user);
            console.log(req.user._id);
            if (req.user.role === 'user') {
                if (review.user._id.toString() !== req.user._id.toString()) {
                    throw new Error(
                        `you are unauthorized for deleting this review!`
                    );
                }
            }
        }),
    validatorMiddleware,
];

exports.checkCreateReview = [
    check('title')
        .optional()
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('rating')
        .notEmpty()
        .withMessage('rating is required')
        .isFloat({ min: 1, max: 5 })
        .withMessage('Rating must be between 1 and 5'),
    check('images').optional().isArray().withMessage('images must be An array'),
    check('product')
        .isMongoId()
        .withMessage('Invalid product id format')
        .custom(async (val, { req }) => {
            const product = await Product.findById(val);
            if (!product) {
                throw new Error(`No product for id: ${val}`);
            }
            const review = await Review.findOne({
                user: req.user._id,
                product: val,
            });
            if (review) {
                return Promise.reject(
                    new Error('You already created a review before')
                );
            }
            return true;
        }),
    validatorMiddleware,
];
