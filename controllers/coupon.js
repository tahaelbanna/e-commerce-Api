const factor = require('./mianController');
const Coupon = require('../models/coupon');

// @desc    create Coupon
// @route   POST /Api/v1/Coupon
// @access  private
exports.addCoupon = factor.addOne(Coupon);

// @desc    get Coupons
// @route   GET /Api/v1/Coupon
// @access  private
exports.getCoupons = factor.getAll(Coupon);

// @desc    get Coupon
// @route   GET /Api/v1/Coupon/:id
// @access  private
exports.getCoupon = factor.getOne(Coupon);

// @desc    update Coupon
// @route   PUT /Api/v1/Coupon/:id
// @access  private
exports.updateCoupon = factor.updateOne(Coupon);

// @desc    delete Coupon
// @route   DELETE /Api/v1/Coupon/:id
// @access  private
exports.deleteCoupon = factor.deleteOne(Coupon);
