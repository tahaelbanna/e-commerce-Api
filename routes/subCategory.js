const express = require('express');
const subCategoryController = require('../controllers/subCategory');
const authController = require('../controllers/auth');

// mergeParams allows us to get params from another route
const router = express.Router({ mergeParams: true });
const Validators = require('../utils/validators/subCategory');

router
    .route('/')
    .post(
        authController.protect,
        authController.allowTo('admin', 'manager'),
        subCategoryController.addIdToBody,
        Validators.checkCreateSubCategory,
        subCategoryController.addSubCategory
    )
    .get(
        subCategoryController.createFilterObj,
        subCategoryController.getSubCategories
    );

router
    .route('/:id')
    .get(Validators.checkGetSubCategory, subCategoryController.getSubCategory)
    .put(
        authController.protect,
        authController.allowTo('admin', 'manager'),
        Validators.checkUpdateSubCategory,
        subCategoryController.updateSubCategory
    )
    .delete(
        authController.protect,
        authController.allowTo('admin'),
        Validators.checkDeleteSubCategory,
        subCategoryController.deleteSubCategory
    );

module.exports = router;
