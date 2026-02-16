const express = require('express');
const productController = require('../controllers/product');
const authController = require('../controllers/auth');
const reviewRouter = require('./review');

const router = express.Router();
const Validators = require('../utils/validators/product');

router
    .route('/')
    .post(
        authController.protect,
        authController.allowTo('admin', 'manager'),
        productController.uploadFields,
        productController.sharpForImageProccessing,
        Validators.checkCreateProduct,
        productController.addProduct
    )
    .get(productController.getProducts);

router.use('/:productId/reviews', reviewRouter);

router
    .route('/:id')
    .get(Validators.checkGetProduct, productController.getProduct)
    .put(
        authController.protect,
        authController.allowTo('admin', 'manager'),
        productController.uploadFields,
        productController.sharpForImageProccessing,
        Validators.checkUpdateProduct,
        productController.updateProduct
    )
    .delete(
        authController.protect,
        authController.allowTo('admin'),
        Validators.checkDeleteProduct,
        productController.deleteProduct
    );

module.exports = router;
