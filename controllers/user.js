/* eslint-disable node/no-missing-require */
// eslint-disable-next-line import/no-unresolved
const { v4: uuidv4 } = require('uuid');
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const bcrypt = require('bcryptjs');
const factor = require('./mianController');
const imageUpload = require('../middlewares/imageUpload');
const apiError = require('../utils/apiError');
const generateToken = require('../utils/generateToken');
const User = require('../models/user');

exports.sharpForImageProccessing = asyncHandler(async (req, res, next) => {
    if (req.file) {
        const fileName = `user-${uuidv4()}-${Date.now()}.jpeg`;
        await sharp(req.file.buffer)
            .resize(300, 300)
            .toFormat('jpeg')
            .jpeg({ quality: 60 })
            .toFile(`uploads/users/${fileName}`);
        req.body.profileImage = fileName;
    }
    next();
});

exports.userFileUploading = imageUpload.uploadOne('profileImage');

// @desc    create User
// @route   POST /Api/v1/users
// @access  private
exports.addUser = factor.addOne(User);

// @desc    get users
// @route   GET /Api/v1/users
// @access  private
exports.getUsers = factor.getAll(User);

// @desc    get User
// @route   GET /Api/v1/users/:id
// @access  private
exports.getUser = factor.getOne(User);

// @desc    update User
// @route   PUT /Api/v1/users/:id
// @access  private
exports.updateUser = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(
        req.params.id,
        {
            name: req.body.name,
            slug: req.body.slug,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            profileImage: req.body.profileImage,
            role: req.body.role,
        },
        {
            new: true,
        }
    );
    if (!document) {
        return next(
            new apiError(`no such ${User} for id: ${req.params.id}`, 404)
        );
    }
    res.json({
        data: document,
    });
});

// @desc    update password
// @route   PUT /Api/v1/users/changePassword/:id
// @access  private
exports.updateUserPassword = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(
        req.params.id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true,
        }
    );
    if (!document) {
        return next(
            new apiError(`no such ${User} for id: ${req.params.id}`, 404)
        );
    }
    res.json({
        data: document,
    });
});

// @desc    delete User
// @route   DELETE /Api/v1/users/:id
// @access  private
exports.deleteUser = factor.deleteOne(User);

// @desc    get User
// @route   DELETE /Api/v1/users/getMe
// @access  private-token
exports.getLoggedUserData = asyncHandler(async (req, res, next) => {
    req.params.id = req.user._id;
    next();
});

// @desc    get User
// @route   DELETE /Api/v1/users/changePassword
// @access  private-token
exports.updateLoggedUserPassword = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(
        req.user._id,
        {
            password: await bcrypt.hash(req.body.password, 12),
            passwordChangedAt: Date.now(),
        },
        {
            new: true,
        }
    );
    if (!document) {
        return next(new apiError(`no such User for id: ${req.params.id}`, 404));
    }
    const token = generateToken(document._id);
    res.json({
        data: document,
        token,
    });
});

// @desc    get User
// @route   DELETE /Api/v1/users/updateMe
// @access  private-token
exports.updateLoggedUser = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(
        req.user._id,
        {
            name: req.body.name,
            slug: req.body.slug,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            profileImage: req.body.profileImage,
            role: req.body.role,
        },
        {
            new: true,
        }
    );
    if (!document) {
        return next(new apiError(`no such User`, 404));
    }
    res.json({
        data: document,
    });
});

// @desc    get User
// @route   DELETE /Api/v1/users/deActiveMe
// @access  private-token
exports.deActiveLoggedUser = asyncHandler(async (req, res, next) => {
    const document = await User.findByIdAndUpdate(req.user._id, {
        active: false,
    });
    if (!document) {
        return next(new apiError(`no such User`, 404));
    }
    res.status(201).json({
        response: 'Account deActivated successfully',
    });
});
