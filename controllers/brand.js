/* eslint-disable node/no-missing-require */
// eslint-disable-next-line import/no-unresolved
const { v4: uuidv4 } = require('uuid');
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const factor = require('./mianController');
const imageUpload = require('../middlewares/imageUpload');
const Brand = require('../models/brand');

exports.sharpForImageProccessing = asyncHandler(async (req, res, next) => {
    if (req.file) {
        const fileName = `brand-${uuidv4()}-${Date.now()}.jpeg`;
        await sharp(req.file.buffer)
            .resize(300, 300)
            .toFormat('jpeg')
            .jpeg({ quality: 60 })
            .toFile(`uploads/brands/${fileName}`);
        req.body.imageUrl = fileName;
    }
    next();
});

exports.brandFileUploading = imageUpload.uploadOne('imageUrl');

// @desc    create Brand
// @route   POST /Api/v1/brand
// @access  private
exports.addBrand = factor.addOne(Brand);

// @desc    get Brands
// @route   GET /Api/v1/brand
// @access  public
exports.getBrands = factor.getAll(Brand);

// @desc    get brand
// @route   GET /Api/v1/brand/:id
// @access  public
exports.getBrand = factor.getOne(Brand);

// @desc    update brand
// @route   PUT /Api/v1/brand/:id
// @access  private
exports.updateBrand = factor.updateOne(Brand);

// @desc    delete brand
// @route   DELETE /Api/v1/brand/:id
// @access  private
exports.deleteBrand = factor.deleteOne(Brand);
