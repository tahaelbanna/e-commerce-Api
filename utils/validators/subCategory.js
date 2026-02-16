const slugify = require('slugify');
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validator');

exports.checkGetSubCategory = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware,
];

exports.checkUpdateSubCategory = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    check('name').optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware,
];

exports.checkDeleteSubCategory = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware,
];

exports.checkCreateSubCategory = [
    check('name')
        .notEmpty()
        .withMessage('name is required')
        .isLength({ min: 3 })
        .withMessage('To Short')
        .isLength({ max: 35 })
        .withMessage('To Long')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('category')
        .notEmpty()
        .withMessage('must be not empty')
        .isMongoId()
        .withMessage('must be a valid id'),
    validatorMiddleware,
];
