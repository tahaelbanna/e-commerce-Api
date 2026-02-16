const slugify = require('slugify');
const { check } = require('express-validator');
const bcrypt = require('bcryptjs');
const validatorMiddleware = require('../../middlewares/validator');
const User = require('../../models/user');

exports.checkGetUser = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    validatorMiddleware,
];

exports.checkUpdateUser = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    check('name')
        .optional()
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
    check('phoneNumber')
        .optional()
        .isMobilePhone(['ar-AE', 'ar-EG', 'ar-SA', 'en-US', 'en-GB'])
        .withMessage(
            'phone Number not valid only accepts [EGY, KSA, UAE, USA, UK]'
        ),
    check('profileImage').optional(),
    check('role').optional(),
    validatorMiddleware,
];

exports.checkUpdateLoggedUser = [
    check('name')
        .optional()
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
    check('phoneNumber')
        .optional()
        .isMobilePhone(['ar-AE', 'ar-EG', 'ar-SA', 'en-US', 'en-GB'])
        .withMessage(
            'phone Number not valid only accepts [EGY, KSA, UAE, USA, UK]'
        ),
    check('profileImage').optional(),
    check('role').optional(),
    validatorMiddleware,
];

exports.checkDeleteUser = [
    check('id').isMongoId().withMessage('Invalid User id format'),
    validatorMiddleware,
];

exports.checkCreateUser = [
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
    check('profileImage').optional(),
    check('role').optional(),
    validatorMiddleware,
];

exports.checkUpdateUserPassword = [
    check('confirmPassword')
        .notEmpty()
        .withMessage('password Confirmation is required'),
    check('currentPassword')
        .notEmpty()
        .withMessage('current password is required'),
    check('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 Characters')
        .custom(async (val, { req }) => {
            const user = await User.findById(req.params.id);
            if (!user) {
                throw new Error(
                    `there is no such user with id: ${req.params.id}`
                );
            }
            const checkValidation = await bcrypt.compare(
                req.body.currentPassword,
                user.password
            );
            if (!checkValidation) {
                throw new Error(
                    `current password: ${req.body.currentPassword} is not matched`
                );
            }
            if (val !== req.body.confirmPassword) {
                throw new Error('password Confirmation is not matched');
            }
            return true;
        }),
    validatorMiddleware,
];

exports.checkUpdateLoggedUserPassword = [
    check('confirmPassword')
        .notEmpty()
        .withMessage('password Confirmation is required'),
    check('currentPassword')
        .notEmpty()
        .withMessage('current password is required'),
    check('password')
        .notEmpty()
        .withMessage('password is required')
        .isLength({ min: 8 })
        .withMessage('password must be at least 8 Characters')
        .custom(async (val, { req }) => {
            const userId = req.user._id;
            const user = await User.findById(userId);
            if (!user) {
                throw new Error(`there is no such user with id: ${userId}`);
            }
            const checkValidation = await bcrypt.compare(
                req.body.currentPassword,
                user.password
            );
            if (!checkValidation) {
                throw new Error(`current password is not matched`);
            }
            if (val !== req.body.confirmPassword) {
                throw new Error('password Confirmation is not matched');
            }
            return true;
        }),
    validatorMiddleware,
];
