const slugify = require('slugify');
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validator');
const User = require('../../models/user');

exports.checkSignUp = [
    check('name')
        .notEmpty()
        .withMessage('name is required')
        .isLength({ min: 3 })
        .withMessage('To Short')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('email')
        .isEmail()
        .withMessage('E-mail not valid')
        .notEmpty()
        .withMessage('email is required')
        .isLowercase()
        .custom(async (val) => {
            const userEmail = await User.findOne({ email: val });
            if (userEmail) {
                return Promise.reject(new Error('this E-mail already in use'));
            }
        }),
    check('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 Characters')
        .custom((val, { req }) => {
            if (val !== req.body.confirmPassword) {
                throw new Error('password Confirmation is not matched');
            }
            return true;
        }),
    check('confirmPassword')
        .notEmpty()
        .withMessage('password Confirmation is required'),
    check('phoneNumber')
        .optional()
        .isMobilePhone(['ar-AE', 'ar-EG', 'ar-SA', 'en-US', 'en-GB'])
        .withMessage(
            'phone Number not valid only accepts [EGY, KSA, UAE, USA, UK]'
        ),
    validatorMiddleware,
];

exports.checkLogIn = [
    check('email')
        .isEmail()
        .withMessage('E-mail not valid')
        .notEmpty()
        .withMessage('email is required')
        .isLowercase(),
    check('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 Characters'),
    validatorMiddleware,
];
