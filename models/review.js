const mongoose = require('mongoose');
const Product = require('./product');

const { Schema } = mongoose;

const reviewSchema = new Schema(
    {
        title: {
            type: String,
            trim: true,
        },
        rating: {
            type: Number,
            min: [1, 'must be greater than or equal 1'],
            max: [5, 'must be less than or equal 5'],
        },
        images: [String],
        user: {
            type: Schema.ObjectId,
            ref: 'User',
            required: [true, 'rating must belongs to a user'],
        },
        product: {
            type: Schema.ObjectId,
            ref: 'Product',
            required: [true, 'rating must belongs to a product'],
        },
    },
    { timestamps: true }
);

reviewSchema.pre(/^find/, function () {
    this.populate({ path: 'user', select: 'name' });
});

reviewSchema.statics.calcAvgOfRatingsAndSumOfRatings = async function (
    productId
) {
    const result = await this.aggregate([
        {
            $match: { product: productId },
        },
        {
            $group: {
                _id: 'product',
                avgRating: { $avg: '$rating' },
                ratingQuantity: { $sum: 1 },
            },
        },
    ]);
    if (result.length > 0) {
        await Product.findByIdAndUpdate(productId, {
            ratingAverage: result[0].avgRating,
            ratingQuantity: result[0].ratingQuantity,
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            ratingAverage: 0,
            ratingQuantity: 0,
        });
    }
};

reviewSchema.post('save', async function () {
    await this.constructor.calcAvgOfRatingsAndSumOfRatings(this.product);
});

reviewSchema.post('deleteOne', { document: true, query: false }, async function () {
    await this.constructor.calcAvgOfRatingsAndSumOfRatings(this.product);
});

module.exports = mongoose.model('Review', reviewSchema);
