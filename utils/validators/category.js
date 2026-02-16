const slugify = require('slugify');
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validator');

exports.checkGetCategory = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware,
];

exports.checkUpdateCategory = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    check('name').optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware,
];

exports.checkDeleteCategory = [
    check('id').isMongoId().withMessage('Invalid category id format'),
    validatorMiddleware,
];

exports.checkCreateCategory = [
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
    validatorMiddleware,
];
