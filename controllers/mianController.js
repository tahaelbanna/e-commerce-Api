const asyncHandler = require('express-async-handler');
const apiError = require('../utils/apiError');
const apiFeatures = require('../utils/apiFeatures');

exports.deleteOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        const document = await Model.findByIdAndDelete(id);
        if (!document) {
            return next(new apiError(`no document found for id: ${id}`, 404));
        }
        // for trigger mongoose middle ware 'deleteOne'
        await document.deleteOne();
        res.status(204).send();
    });

exports.updateOne = (Model) =>
    asyncHandler(async (req, res, next) => {
        const document = await Model.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );
        if (!document) {
            return next(
                new apiError(`no such ${Model} for id: ${req.params.id}`, 404)
            );
        }
        // for trigger mongoose middle ware 'save'
        await document.save();
        res.json({
            data: document,
        });
    });

exports.addOne = (Model) =>
    asyncHandler(async (req, res) => {
        const document = await Model.create(req.body);
        res.json({ data: document });
    });

exports.getOne = (Model, options) =>
    asyncHandler(async (req, res, next) => {
        const { id } = req.params;
        let query = Model.findById(id);
        if (options) {
            query = Model.findById(id).populate(options);
        }
        const document = await query;
        if (!document) {
            return next(new apiError(`no such ${Model} for id: ${id}`, 404));
        }
        res.json({
            data: document,
        });
    });

exports.getAll = (Model) =>
    asyncHandler(async (req, res) => {
        // nested route
        let filterParams = {};
        if (req.filterObj) {
            filterParams = req.filterObj;
        }
        const countDocument = await Model.countDocuments();
        const apiFet = new apiFeatures(Model.find(filterParams), req.query)
            .filter()
            .Search()
            .sort()
            .limitFields()
            .Paginate(countDocument);
        const { mongooseQuery, paginationResult } = apiFet;
        const document = await mongooseQuery;
        res.json({
            results: document.length,
            paginationResult,
            data: document,
        });
    });
