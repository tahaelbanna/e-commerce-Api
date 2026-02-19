const express = require('express');
const couponController = require('../controllers/coupon');
const authController = require('../controllers/auth');

const router = express.Router();

router
    .route('/')
    .post(
        authController.protect,
        authController.allowTo('admin', 'manager'),
        couponController.addCoupon
    )
    .get(
        authController.protect,
        authController.allowTo('admin', 'manager'),
        couponController.getCoupons
    );

router
    .route('/:id')
    .get(
        authController.protect,
        authController.allowTo('admin', 'manager'),
        couponController.getCoupon
    )
    .put(
        authController.protect,
        authController.allowTo('admin', 'manager'),
        couponController.updateCoupon
    )
    .delete(
        authController.protect,
        authController.allowTo('admin', 'manager'),
        couponController.deleteCoupon
    );

module.exports = router;
