const asyncHandler = require('express-async-handler');
const User = require('../models/user');

// @desc    create Address
// @route   POST /Api/v1/Addresses
// @access  private-User
exports.addAddress = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $addToSet: { address: req.body },
        },
        {
            new: true,
        }
    );
    res.status(201).json({
        status: 'success',
        message: 'address have been added successfully',
        data: user.address,
    });
});

// @desc    delete Address
// @route   DELETE /Api/v1/Addresses/:addressId
// @access  private-User
exports.deleteAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $pull: { address: { _id: req.params.addressId } },
        },
        {
            new: true,
        }
    );

    res.status(201).json({
        status: 'success',
        message: 'addressId removed successfully',
        data: user.address,
    });
});

// @desc    get Address
// @route   GET /Api/v1/Addresses
// @access  private-User
exports.getAddress = asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.user._id).populate('address');
    res.status(201).json({
        status: 'success',
        result: user.address.length,
        data: user.address,
    });
});
