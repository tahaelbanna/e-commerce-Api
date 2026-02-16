const express = require('express');
const brandController = require('../controllers/brand');
const authController = require('../controllers/auth');

const router = express.Router();
const Validators = require('../utils/validators/brand');

router
    .route('/')
    .post(
        authController.protect,
        authController.allowTo('admin', 'manager'),
        brandController.brandFileUploading,
        brandController.sharpForImageProccessing,
        Validators.checkCreateBrand,
        brandController.addBrand
    )
    .get(brandController.getBrands);

router
    .route('/:id')
    .get(Validators.checkGetBrand, brandController.getBrand)
    .put(
        authController.protect,
        authController.allowTo('admin', 'manager'),
        brandController.brandFileUploading,
        brandController.sharpForImageProccessing,
        Validators.checkUpdateBrand,
        brandController.updateBrand
    )
    .delete(
        authController.protect,
        authController.allowTo('admin'),
        Validators.checkDeleteBrand,
        brandController.deleteBrand
    );

module.exports = router;
