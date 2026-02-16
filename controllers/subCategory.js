const SubCategory = require('../models/subCategory');
const factor = require('./mianController');

// for creating nested route
exports.addIdToBody = (req, res, next) => {
    if (!req.body.category) {
        req.body.category = req.params.categoryId;
    }
    next();
};

// nested route
// @route   GET /Api/v1/categories/:categoryId/subcategories
exports.createFilterObj = (req, res, next) => {
    let filterObject = {};
    if (req.params.categoryId)
        filterObject = { category: req.params.categoryId };
    req.filterObj = filterObject;
    next();
};

// @desc    create Sub Category
// @route   POST /Api/v1/subcategories
// @access  private
exports.addSubCategory = factor.addOne(SubCategory);

// @desc    get sub categories
// @route   GET /Api/v1/subcategories
// @access  public
exports.getSubCategories = factor.getAll(SubCategory);
// @desc    get sub category
// @route   GET /Api/v1/subcategories/:id
// @access  public
exports.getSubCategory = factor.getOne(SubCategory);

// @desc    update sub category
// @route   PUT /Api/v1/subcategories/:id
// @access  private
exports.updateSubCategory = factor.updateOne(SubCategory);

// @desc    delete sub category
// @route   DELETE /Api/v1/subcategories/:id
// @access  private
exports.deleteSubCategory = factor.deleteOne(SubCategory);
