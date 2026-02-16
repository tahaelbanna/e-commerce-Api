const mongoose = require('mongoose');

const { Schema } = mongoose;

const couponSchema = new Schema(
    {
        name: {
            type: String,
            trim: true,
            required: [true, 'coupon name is required'],
        },
        expireDate: {
            type: Date,
            required: [true, 'coupon expireDate is required'],
        },
        discount: {
            type: Number,
            required: [true, 'discount value name is required'],
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Coupon', couponSchema);
