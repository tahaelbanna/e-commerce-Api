const slugify = require('slugify');
const { check } = require('express-validator');
const validatorMiddleware = require('../../middlewares/validator');
const Category = require('../../models/category');
const subCategory = require('../../models/subCategory');

exports.checkGetProduct = [
    check('id').isMongoId().withMessage('Invalid Product id format'),
    validatorMiddleware,
];

exports.checkUpdateProduct = [
    check('id').isMongoId().withMessage('Invalid Product id format'),
    check('title').optional().custom((val, { req }) => {
        req.body.slug = slugify(val);
        return true;
    }),
    validatorMiddleware,
];

exports.checkDeleteProduct = [
    check('id').isMongoId().withMessage('Invalid Product id format'),
    validatorMiddleware,
];

exports.checkCreateProduct = [
    check('title')
        .notEmpty()
        .withMessage('title is required')
        .isLength({ min: 3 })
        .withMessage('To Short')
        .isLength({ max: 100 })
        .withMessage('To Long')
        .custom((val, { req }) => {
            req.body.slug = slugify(val);
            return true;
        }),
    check('description')
        .notEmpty()
        .withMessage('description is required')
        .isLength({ min: 20 })
        .withMessage('To Short'),
    check('quantity')
        .notEmpty()
        .withMessage('quantity is required')
        .isNumeric()
        .withMessage('quantity must be numeric'),
    check('sold')
        .optional()
        .isNumeric()
        .withMessage('sold quantity must be numeric'),
    check('price')
        .notEmpty()
        .withMessage('price is required')
        .isNumeric()
        .withMessage('price must be numeric'),
    check('priceAfterDiscount')
        .optional()
        .toFloat()
        .isNumeric()
        .withMessage('price must be numeric')
        .custom((value, { req }) => {
            if (req.body.price <= value) {
                throw new Error(
                    'priceAfterDiscount must be less than current price'
                );
            }
            return true;
        }),
    check('colors').optional().isArray().withMessage('colors must be An array'),
    check('imageCover').notEmpty().withMessage('imageCover is required'),
    check('images').optional().isArray().withMessage('images must be An array'),
    check('category')
        .notEmpty()
        .withMessage('category is required')
        .isMongoId()
        .withMessage('Invalid category id format')
        .custom(async (categoryId) => {
            const category = await Category.findById(categoryId);
            if (!category) {
                throw new Error(`No category for id: ${categoryId}`);
            }
            return true;
        }),
    check('subcategories')
        .optional()
        .isMongoId()
        .withMessage('Invalid subcategory id format')
        .custom(async (subCategoryIds) => {
            const SubCategory = await subCategory.find({
                _id: { $exists: true, $in: subCategoryIds },
            });
            if (
                SubCategory.length <= 0 ||
                SubCategory.length !== subCategoryIds.length
            ) {
                throw new Error(`No sub categories for ids: ${subCategoryIds}`);
            }
            return true;
        })
        .custom(async (arr, { req }) => {
            const SubCategories = await subCategory.find({
                category: req.body.category,
            });
            const categorysSubcategories = [];
            SubCategories.forEach((sub) => {
                categorysSubcategories.push(sub._id.toString());
            });
            const Check = arr.every((v) => categorysSubcategories.includes(v));
            if (!Check) {
                throw new Error(
                    `Unmatched sub categoried for categort: ${req.body.category}`
                );
            }
        }),
    check('brand')
        .optional()
        .isMongoId()
        .withMessage('Invalid brand id format'),
    check('ratingAverage')
        .optional()
        .isNumeric()
        .withMessage('ratingAverage must be numeric')
        .isLength({ min: 1 })
        .withMessage('To Short')
        .isLength({ max: 5 })
        .withMessage('To Long'),
    check('ratingQuantity')
        .optional()
        .isNumeric()
        .withMessage('ratingAverage must be numeric'),
    validatorMiddleware,
];
