const express = require('express');
const categoryController = require('../controllers/category');
const authController = require('../controllers/auth');
const subCategoryRouter = require('./subCategory');

const router = express.Router();
const Validators = require('../utils/validators/category');

router
    .route('/')
    .post(
        authController.protect,
        authController.allowTo('admin', 'manager'),
        categoryController.categoryFileUploading,
        categoryController.sharpForImageProccessing,
        Validators.checkCreateCategory,
        categoryController.addCategory
    )
    .get(categoryController.getCategories);

router.use('/:categoryId/subcategories', subCategoryRouter);

router
    .route('/:id')
    .get(Validators.checkGetCategory, categoryController.getCategory)
    .put(
        authController.protect,
        authController.allowTo('admin', 'manager'),
        categoryController.categoryFileUploading,
        categoryController.sharpForImageProccessing,
        Validators.checkUpdateCategory,
        categoryController.updateCategory
    )
    .delete(
        authController.protect,
        authController.allowTo('admin'),
        Validators.checkDeleteCategory,
        categoryController.deleteCategory
    );

module.exports = router;
