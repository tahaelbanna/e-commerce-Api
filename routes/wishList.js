const express = require('express');
const authController = require('../controllers/auth');
const wishListController = require('../controllers/wishList');

const router = express.Router();

router.route('/').post(
    authController.protect,
    authController.allowTo('user'),
    wishListController.addWshList
)
router.route('/:productId').delete(
    authController.protect,
    authController.allowTo('user'),
    wishListController.deleteWishList
)
router.route('/').get(
    authController.protect,
    authController.allowTo('user'),
    wishListController.getWshList
)

module.exports = router;