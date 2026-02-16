const mongoose = require('mongoose');

const { Schema } = mongoose;

const cartSchema = new Schema(
    {
        cartItems: [
            {
                product: {
                    type: Schema.ObjectId,
                    ref: 'Product',
                },
                color: String,
                price: Number,
                quantity: {
                    type: Number,
                    default: 1,
                },
            },
        ],
        totalPrice: Number,
        totalPriceAfterDiscount: Number,
        user: {
            type: Schema.ObjectId,
            ref: 'User',
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

cartSchema.virtual('totalCartQuantity').get(function () {
    if (this.cartItems) {
        return this.cartItems.reduce((total, item) => total + item.quantity, 0);
    }
    return 0;
});

module.exports = mongoose.model('Cart', cartSchema);
