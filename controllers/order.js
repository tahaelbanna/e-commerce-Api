const asyncHandler = require('express-async-handler');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const factor = require('./mianController');
const apiError = require('../utils/apiError');
const Order = require('../models/order');
const Cart = require('../models/cart');
const Product = require('../models/product');
const User = require('../models/user');

exports.filterOrdersForLoggedUser = (req, res, next) => {
    let filter = {};
    if (req.user.role === 'user') {
        filter = { user: req.user._id };
    }
    req.filterObj = filter;
    next();
};

// @desc    craete cach order
// @route   POST /Api/v1/orders
// @access  private
exports.createOrder = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new apiError('this cart Not found', 404));
    }
    const cartPrice = cart.totalPriceAfterDiscount
        ? cart.totalPriceAfterDiscount
        : cart.totalPrice;
    const taxPrice = 0;
    const shipingPrice = 0;
    const totalPrice = cartPrice + taxPrice + shipingPrice;
    const order = await Order.create({
        user: req.user._id,
        cartItems: cart.cartItems,
        shippingAddress: req.body.shippingAddress,
        totalOrderPrice: totalPrice,
    });
    if (order) {
        const bulkOptions = cart.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: {
                    $inc: { quantity: -item.quantity, sold: +item.quantity },
                },
            },
        }));
        await Product.bulkWrite(bulkOptions, {});
        await Cart.findByIdAndDelete(cart._id);
    }
    res.status(201).json({
        status: 'success',
        data: order,
    });
});

// @desc    get all orders
// @route   POST /Api/v1/orders
// @access  private
exports.getAllOrder = factor.getAll(Order);

// @desc    get one order
// @route   POST /Api/v1/orders
// @access  private
exports.getSpecificOrder = factor.getOne(Order);

// @desc    update paid status
// @route   POST /Api/v1/orders/:orderId/pay
// @access  private
exports.updatePaidStatus = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
        return next(new apiError('there is no order for that id', 404));
    }
    order.isPaid = true;
    order.paidAt = Date.now();
    const updatedOrder = await order.save();
    res.status(201).json({
        status: 'success',
        data: updatedOrder,
    });
});

// @desc    update delivery status
// @route   POST /Api/v1/orders/:orderId/delivry
// @access  private
exports.updateDeliveryStatus = asyncHandler(async (req, res, next) => {
    const order = await Order.findById(req.params.orderId);
    if (!order) {
        return next(new apiError('there is no order for that id', 404));
    }
    order.isDelivered = true;
    order.deliveredAt = Date.now();
    const updatedOrder = await order.save();
    res.status(201).json({
        status: 'success',
        data: updatedOrder,
    });
});

// @desc    Strip checkout
// @route   POST /Api/v1/orders/checkout-session
// @access  private
exports.checkOutSession = asyncHandler(async (req, res, next) => {
    // 1. Get cart depend on cartId
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new apiError('this cart Not found', 404));
    }
    // 2. Get order price depend on cart price "Check if coupon applied"
    const cartPrice = cart.totalPriceAfterDiscount
        ? cart.totalPriceAfterDiscount
        : cart.totalPrice;
    const totalOrderPrice = cartPrice;

    // 3. Create stripe checkout session
    const session = await stripe.checkout.sessions.create({
        line_items: [
            {
                price_data: {
                    currency: 'egp',
                    unit_amount: totalOrderPrice * 100,
                    product_data: {
                        name: req.user.name,
                    },
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        success_url: `${req.protocol}://${req.get('host')}/api/v1/orders`,
        cancel_url: `${req.protocol}://${req.get('host')}/api/v1/cart`,
        customer_email: req.user.email,
        client_reference_id: cart._id.toString(),
        metadata: {
            shippingAddress_city: req.body.shippingAddress.city,
            shippingAddress_details: req.body.shippingAddress.details,
            shippingAddress_phone: req.body.shippingAddress.phone,
        },
    });

    // 4. send session to response
    res.status(200).json({
        status: 'success',
        session,
    });
});

// @desc    create card order
// @access  private
const createCardOrder = async (session) => {
    const cartId = session.client_reference_id;
    const shippingAddress = {
        city: session.metadata.shippingAddress_city,
        details: session.metadata.shippingAddress_details,
        phone: session.metadata.shippingAddress_phone,
    };
    const orderPrice = session.amount_total / 100;
    const user = await User.findOne({ email: session.customer_email });
    const cart = await Cart.findById(cartId);
    const order = await Order.create({
        user: user._id,
        cartItems: cart.cartItems,
        shippingAddress,
        totalOrderPrice: orderPrice,
        isPaid: true,
        paidAt: Date.now(),
        paymentMethod: 'card',
    });
    if (order) {
        const bulkOption = cart.cartItems.map((item) => ({
            updateOne: {
                filter: { _id: item.product },
                update: {
                    $inc: { quantity: -item.quantity, sold: +item.quantity },
                },
            },
        }));
        await Product.bulkWrite(bulkOption, {});
        await Cart.findByIdAndDelete(cartId);
    }
};

// @desc    weeb hook
// @access  private
exports.webhookCheckout = asyncHandler(async (req, res, next) => {
    console.log('start');
    let event;
    if (!process.env.STRIPE_ENDPOINT_SECRET_KEY) {
        console.log('Error: STRIPE_ENDPOINT_SECRET_KEY is missing in Render!');
        return res.status(400).send('Webhook Error: No Secret Key');
    }
    if (process.env.STRIPE_ENDPOINT_SECRET_KEY) {
        const signature = req.headers['stripe-signature'];
        try {
            event = stripe.webhooks.constructEvent(
                req.body,
                signature,
                process.env.STRIPE_ENDPOINT_SECRET_KEY
            );
        } catch (err) {
            console.log(
                `⚠️ Webhook signature verification failed.`,
                err.message
            );
            return res.status(400).send(`Webhook Error: ${err.message}`);
        }
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            createCardOrder(session);
        }
    }
    res.status(200).json({ received: true });
});
