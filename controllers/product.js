// eslint-disable-next-line import/no-unresolved, node/no-missing-require
const { v4: uuidv4 } = require('uuid');
// eslint-disable-next-line import/no-extraneous-dependencies
const sharp = require('sharp');
const asyncHandler = require('express-async-handler');
const imageUpload = require('../middlewares/imageUpload');
const factor = require('./mianController');
const Product = require('../models/product');

exports.uploadFields = imageUpload.uploadOneAndMore([
    {
        name: 'imageCover',
        maxCount: 1,
    },
    {
        name: 'images',
        maxCount: 5,
    },
]);

exports.sharpForImageProccessing = asyncHandler(async (req, res, next) => {
    if (req.files.imageCover) {
        const fileName = `product-${uuidv4()}-${Date.now()}-cover.jpeg`;
        await sharp(req.files.imageCover[0].buffer)
            .resize(2000, 1333)
            .toFormat('jpeg')
            .jpeg({ quality: 60 })
            .toFile(`uploads/products/${fileName}`);
        req.body.imageCover = fileName;
    }
    if (req.files.images) {
        req.body.images = [];
        await Promise.all(
            req.files.images.map(async (img, index) => {
                const fileName = `product-${uuidv4()}-${Date.now()}-${index + 1}.jpeg`;
                await sharp(img.buffer)
                    .resize(2000, 1333)
                    .toFormat('jpeg')
                    .jpeg({ quality: 60 })
                    .toFile(`uploads/products/${fileName}`);
                req.body.images.push(fileName);
            })
        );
    }
    next();
});

// @desc    create product
// @route   POST /Api/v1/products
// @access  private
exports.addProduct = factor.addOne(Product, 'Products');

// @desc    get products
// @route   GET /Api/v1/products
// @access  public
exports.getProducts = factor.getAll(Product);

// @desc    get product
// @route   GET /Api/v1/products/:id
// @access  public
exports.getProduct = factor.getOne(Product, 'reviews');

// @desc    update product
// @route   PUT /Api/v1/products/:id
// @access  private
exports.updateProduct = factor.updateOne(Product);

// @desc    delete product
// @route   DELETE /Api/v1/products/:id
// @access  private
exports.deleteProduct = factor.deleteOne(Product);
