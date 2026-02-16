const categoryRout = require('./category');
const subCategoryRout = require('./subCategory');
const brandRoute = require('./brand');
const productRoute = require('./product');
const userRoute = require('./user');
const authRoute = require('./auth');
const reviewRoute = require('./review');
const wishListRoute = require('./wishList');
const addressRoute = require('./address');
const couponRoute = require('./coupon');
const cartRoute = require('./cart');
const orderRoute = require('./order');


module.exports = (app) => {
    app.use('/api/v1/categories', categoryRout);
    app.use('/api/v1/subcategories', subCategoryRout);
    app.use('/api/v1/brands', brandRoute);
    app.use('/api/v1/products', productRoute);
    app.use('/api/v1/users', userRoute);
    console.log('lol3');
    app.use('/api/v1/auth', authRoute);
    app.use('/api/v1/reviews', reviewRoute);
    app.use('/api/v1/wishLists', wishListRoute);
    app.use('/api/v1/addresses', addressRoute);
    app.use('/api/v1/coupons', couponRoute);
    app.use('/api/v1/cart', cartRoute);
    app.use('/api/v1/orders', orderRoute);
}
