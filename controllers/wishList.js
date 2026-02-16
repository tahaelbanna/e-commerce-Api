const asyncHandler = require('express-async-handler');
const User = require('../models/user');
const apiError = require('../utils/apiError');
// @desc    create WshList
// @route   POST /Api/v1/WshList
// @access  private
exports.addWshList = asyncHandler(async (req, res) => {
    // addToSet: provided by mongodb to add something in a unique list
    // if that something is already exists it dosen't return error
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: { wishList: req.body.productId },
        },
        {
            new: true,
        }
    );
    res.status(201).json({
        status: 'success',
        message: 'product added to wish list successfully',
        data: user.wishList,
    });
});

// @desc    delete WshList
// @route   DELETE /Api/v1/WshList/:productId
// @access  private
exports.deleteWishList = asyncHandler(async (req, res, next) => {
    // pull: provided by mongodb to remove something from a unique list
    // if that something is already not exists it dosen't return error
    const user = await User.findOneAndUpdate(
        {
            _id: req.user._id,
            wishList: req.params.productId,
        },
        {
            $pull: { wishList: req.params.productId },
        },
        {
            new: true,
        }
    );

    if (!user) {
        return next(new apiError('Unauthorized Access', 404));
    }

    res.status(201).json({
        status: 'success',
        message: 'product removed from wish list successfully',
        data: user.wishList,
    });
});

// @desc    get WshList
// @route   GET /Api/v1/WshList/:id
// @access  public
exports.getWshList = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('wishList');
    res.status(201).json({
        status: 'success',
        result: user.wishList.length,
        data: user.wishList,
    });
});
