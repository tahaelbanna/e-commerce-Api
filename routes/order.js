const express = require('express');
const orderController = require('../controllers/order');
const authController = require('../controllers/auth');

const router = express.Router();

router.post(
    '/checkout-session',
    authController.protect,
    authController.allowTo('user'),
    orderController.checkOutSession
);

router
    .route('/')
    .post(
        authController.protect,
        authController.allowTo('user'),
        orderController.createOrder
    )
    .get(
        authController.protect,
        authController.allowTo('user', 'admin', 'manager'),
        orderController.filterOrdersForLoggedUser,
        orderController.getAllOrder
    );

router.get(
    '/:id',
    authController.protect,
    authController.allowTo('user'),
    orderController.getSpecificOrder
);
router.put(
    '/:orderId/pay',
    authController.protect,
    authController.allowTo('admin', 'manager'),
    orderController.updatePaidStatus
);
router.put(
    '/:orderId/delivry',
    authController.protect,
    authController.allowTo('admin', 'manager'),
    orderController.updateDeliveryStatus
);

module.exports = router;
