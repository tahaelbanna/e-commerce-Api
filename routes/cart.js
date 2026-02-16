const express = require('express');
const cartController = require('../controllers/cart');
const authController = require('../controllers/auth');

const router = express.Router();
// const Validators = require('../utils/validators/cart');

router.put(
    '/applyCoupon',
    authController.protect,
    authController.allowTo('user'),
    cartController.applyCoupon
);

router
    .route('/')
    .post(
        authController.protect,
        authController.allowTo('user'),
        cartController.addToCart
    )
    .get(
        authController.protect,
        authController.allowTo('user'),
        cartController.getLoggedUserCart
    )
    .delete(
        authController.protect,
        authController.allowTo('user'),
        cartController.deleteCart
    );


router
    .route('/:itemId')
    .delete(
        authController.protect,
        authController.allowTo('user'),
        cartController.deleteItemFromCart
    )
    .put(
        authController.protect,
        authController.allowTo('user'),
        cartController.updateProductQuantity
    );

module.exports = router;
