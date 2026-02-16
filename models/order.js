const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema(
    {
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Order must belong to user'],
        },
        cartItems: [
            {
                product: {
                    type: Schema.Types.ObjectId,
                    ref: 'Product',
                },
                color: String,
                price: Number,
                quantity: Number,
            },
        ],
        shippingAddress: {
            details: String,
            phoneNumber: String,
            city: String,
            postalCode: String,
        },
        taxPrice: {
            type: Number,
            default: 0,
        },
        shippingPrice: {
            type: Number,
            default: 0,
        },
        totalOrderPrice: {
            type: Number,
        },
        paymentMethod: {
            type: String,
            enum: ['cash', 'card'],
            default: 'cash',
        },
        isPaid: {
            type: Boolean,
            default: false,
        },
        paidAt: Date,
        isDelivered: {
            type: Boolean,
            default: false,
        },
        deliveredAt: Date,
    },
    {
        timestamps: true,
    }
);

orderSchema.pre(/^find/, function (next){
    this.populate({ path: 'user', select: 'name email' }).populate({
        path: 'cartItems.product',
        select: 'title imageCover',
    });
});

module.exports = mongoose.model('Order', orderSchema);
