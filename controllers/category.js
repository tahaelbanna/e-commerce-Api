/* eslint-disable node/no-missing-require */
// eslint-disable-next-line import/no-unresolved
const { v4: uuidv4 } = require('uuid');
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const factor = require('./mianController');
const imageUpload = require('../middlewares/imageUpload');
const Category = require('../models/category');

exports.sharpForImageProccessing = asyncHandler(async (req, res, next) => {
    if (req.file) {
        const fileName = `category-${uuidv4()}-${Date.now()}.jpeg`;
        await sharp(req.file.buffer)
            .resize(300, 300)
            .toFormat('jpeg')
            .jpeg({ quality: 60 })
            .toFile(`uploads/categories/${fileName}`);
        req.body.imageUrl = fileName;
    }
    next();
});

exports.categoryFileUploading = imageUpload.uploadOne('imageUrl');

// @desc    create category
// @route   POST /Api/v1/categories
// @access  private
exports.addCategory = factor.addOne(Category);

// @desc    get categories
// @route   GET /Api/v1/categories
// @access  public
exports.getCategories = factor.getAll(Category);

// @desc    get category
// @route   GET /Api/v1/categories/:id
// @access  public
exports.getCategory = factor.getOne(Category);

// @desc    update category
// @route   PUT /Api/v1/categories/:id
// @access  private
exports.updateCategory = factor.updateOne(Category);

// @desc    delete category
// @route   DELETE /Api/v1/categories/:id
// @access  private
exports.deleteCategory = factor.deleteOne(Category);
