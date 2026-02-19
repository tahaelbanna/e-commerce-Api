const asyncHandler = require('express-async-handler');
const Product = require('../models/product');
const Cart = require('../models/cart');
const apiError = require('../utils/apiError');
const Coupon = require('../models/coupon');

const calcTotalCartPrice = (cart) => {
    let totalPrice = 0;
    cart.cartItems.forEach((item) => {
        totalPrice += item.quantity * item.price;
    });
    cart.totalPrice = totalPrice;
    cart.totalPriceAfterDiscount = undefined;
    return totalPrice;
};

// @desc    add to cart
// @route   POST /Api/v1/cart
// @access  public
exports.addToCart = asyncHandler(async (req, res, next) => {
    const { productId, color, quantity } = req.body;
    const product = await Product.findById(productId);
    if (!product) {
        return next(new apiError('Product not found', 404));
    }
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        cart = new Cart({
            user: req.user._id,
            cartItems: [
                { product: productId, color, price: product.price, quantity },
            ],
        });
    } else {
        const productIndex = cart.cartItems.findIndex(
            (item) =>
                item.product.toString() === productId.toString() &&
                item.color === color
        );
        if (productIndex > -1) {
            const cartItem = cart.cartItems[productIndex];
            cartItem.quantity += quantity;
            cart.cartItems[productIndex] = cartItem;
        } else {
            cart.cartItems.push({
                product: productId,
                color,
                price: product.price,
                quantity,
            });
        }
    }
    calcTotalCartPrice(cart);
    const { totalPrice } = cart;
    if (req.body.coupon) {
        const coupon = await Coupon.findOne({
            name: req.body.coupon,
            expireDate: { $gt: Date.now() },
        });
        if (!coupon) {
            return next(new apiError('Coupon is invalid', 400));
        }
        const discount = (totalPrice * coupon.discount) / 100;
        cart.totalPriceAfterDiscount = (totalPrice - discount).toFixed(2);
    }
    await cart.save();
    res.status(200).json({
        status: 'success',
        message: 'Product added to cart successfully',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
});

// @desc    delete cart
// @route   DELETE /Api/v1/cart
// @access  private
exports.getLoggedUserCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new apiError('add products to create a cart!', 404));
    }
    res.status(201).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
});

// @desc    get cart
// @route   GET /Api/v1/cart/:itemId
// @access  public
exports.deleteItemFromCart = asyncHandler(async (req, res, next) => {
    const cart = await Cart.findOneAndUpdate(
        { user: req.user._id },
        {
            $pull: { cartItems: { _id: req.params.itemId } },
        },
        { new: true }
    );
    calcTotalCartPrice(cart);
    await cart.save();
    res.status(201).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
});

// @desc    get cart
// @route   GET /Api/v1/cart
// @access  public
exports.deleteCart = asyncHandler(async (req, res, next) => {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.status(204).json({
        message: 'cart deleted succssfully',
    });
});

// @desc    get cart
// @route   GET /Api/v1/cart/:itemId
// @access  public
exports.updateProductQuantity = asyncHandler(async (req, res, next) => {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new apiError('add products to create a cart!', 404));
    }
    const productIndex = cart.cartItems.findIndex(
        (item) => item._id.toString() === req.params.itemId.toString()
    );
    if (productIndex > -1) {
        const cartItem = cart.cartItems[productIndex];
        cartItem.quantity = quantity;
        cart.cartItems[productIndex] = cartItem;
    } else {
        return next(new apiError('cartItem not found!', 404));
    }
    calcTotalCartPrice(cart);
    await cart.save();
    res.status(200).json({
        status: 'success',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
});

// @desc    get cart
// @route   GET /Api/v1/cart/applyCoupon
// @access  public
exports.applyCoupon = asyncHandler(async (req, res, next) => {
    const coupon = await Coupon.findOne({
        name: req.body.coupon,
        expireDate: { $gt: Date.now() },
    });
    if (!coupon) {
        return next(new apiError('Coupon is invalid', 400));
    }
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
        return next(new apiError('There is no cart for this user', 404));
    }
    const { totalPrice } = cart;
    const discount = (totalPrice * coupon.discount) / 100;
    cart.totalPriceAfterDiscount = (totalPrice - discount).toFixed(2);
    await cart.save();
    res.status(200).json({
        status: 'success',
        message: 'coupon applied successfully',
        numOfCartItems: cart.cartItems.length,
        data: cart,
    });
});
