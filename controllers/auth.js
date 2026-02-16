const crypto = require('crypto');
const asyncHandler = require('express-async-handler');
// eslint-disable-next-line import/no-extraneous-dependencies
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const apiError = require('../utils/apiError');
const sendEmail = require('../utils/emailProvider');
const generateToken = require('../utils/generateToken');
const User = require('../models/user');

// @desc    sign up
// @route   POST /Api/v1/auth/signup
// @access  public
exports.signUp = asyncHandler(async (req, res, next) => {
    // create user
    const user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        phoneNumber: req.body.phoneNumber,
    });
    // generate token
    const token = generateToken(user._id);
    // send response
    res.status(201).json({
        data: user,
        token,
    });
});

// @desc    login
// @route   POST /Api/v1/auth/login
// @access  public
exports.logIn = asyncHandler(async (req, res, next) => {
    // check user
    const user = await User.findOne({ email: req.body.email });
    if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
        return next(new apiError('Invalid Login Informations', 401));
    }
    // generate token
    const token = generateToken(user._id);
    // send response
    res.status(200).json({
        data: user,
        token,
    });
});

exports.protect = asyncHandler(async (req, res, next) => {
    // check if token exists
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return next(new apiError('login to get access!', 401));
    }
    // verify if token options not change
    const decode = jwt.verify(token, process.env.JWT_SECURETY_KEY);
    // check if user exists
    const user = await User.findById(decode.userId);
    if (!user) {
        return next(
            new apiError('this account no longer exists, login again!', 401)
        );
    }
    // check user password
    if (user.passwordChangedAt) {
        const passwordChangedTimeStamp = parseInt(
            user.passwordChangedAt.getTime() / 1000,
            10
        );
        if (passwordChangedTimeStamp > decode.iat) {
            return next(new apiError('Invalid Session, Login again!', 401));
        }
    }
    req.user = user;
    next();
});

exports.allowTo = (...roles) =>
    asyncHandler(async (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return next(new apiError('Unauthorized access', 403));
        }
        next();
    });

// @desc    forgetPassword
// @route   POST /Api/v1/auth/forgotPassword
// @access  public
exports.forgetPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    console.log(user);
    if (!user) {
        return next(new apiError("can't find this email", 404));
    }
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedCode = crypto.createHash('sha256').update(code).digest('hex');
    user.resetCode = hashedCode;
    user.resetCodeExpiry = Date.now() + 10 * 60 * 1000;
    user.verifyResetCode = false;
    await user.save();
    // const message = `Hi ${user.name},
    //     We received a request to reset the password on your E-shop Account.
    //     ${code}
    //     Enter this code to complete the reset.
    //     Thanks for helping us keep your account secure.
    //     The E-shop Team`;
    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset code (valid for 10 min)',
            name: user.name,
            code,
        });
    } catch (err) {
        user.resetCode = undefined;
        user.resetCodeExpiry = undefined;
        user.verifyResetCode = undefined;
        await user.save();
        console.log(err);
        return next(new apiError('There is an error in sending email', 500));
    }
    console.log('lol4');
    res.status(200).json({
        status: 'Success',
        message: 'Reset code sent to email',
    });
});

// @desc    verifyResetCode
// @route   POST /Api/v1/auth/verifyResetCode
// @access   private-User
exports.verifyResetCode = asyncHandler(async (req, res, next) => {
    const hashedCode = crypto
        .createHash('sha256')
        .update(req.body.resetCode)
        .digest('hex');
    const user = await User.findOne({
        resetCode: hashedCode,
        resetCodeExpiry: { $gt: Date.now() },
    });
    if (!user) {
        return next(new apiError('Reset code invalid or expired', 404));
    }
    user.verifyResetCode = true;
    await user.save();
    res.status(200).json({
        status: 'Success',
    });
});

// @desc    resetPassword
// @route   POST /Api/v1/auth/resetPassword
// @access   private-User
exports.resetPassword = asyncHandler(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new apiError('this email is not defined', 404));
    }
    if (!user.verifyResetCode) {
        return next(new apiError('this email is not verified', 404));
    }
    user.password = req.body.newPassword;
    user.passwordChangedAt = Date.now();
    user.resetCode = undefined;
    user.resetCodeExpiry = undefined;
    user.verifyResetCode = undefined;
    await user.save();
    const token = generateToken(user._id);
    res.status(200).json({
        token,
    });
});
