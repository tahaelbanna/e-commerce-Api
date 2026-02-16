const express = require('express');
const authController = require('../controllers/auth');
const addressController = require('../controllers/address');

const router = express.Router();

router
    .route('/')
    .post(
        authController.protect,
        authController.allowTo('user'),
        addressController.addAddress
    );
router
    .route('/:addressId')
    .delete(
        authController.protect,
        authController.allowTo('user'),
        addressController.deleteAddress
    );
router
    .route('/')
    .get(
        authController.protect,
        authController.allowTo('user'),
        addressController.getAddress
    );

module.exports = router;
