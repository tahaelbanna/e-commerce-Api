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
    app.use('/Api/v1/categories', categoryRout);
    app.use('/Api/v1/subcategories', subCategoryRout);
    app.use('/Api/v1/brands', brandRoute);
    app.use('/Api/v1/products', productRoute);
    app.use('/Api/v1/users', userRoute);
    app.use('/Api/v1/auth', authRoute);
    app.use('/Api/v1/reviews', reviewRoute);
    app.use('/Api/v1/wishLists', wishListRoute);
    app.use('/Api/v1/addresses', addressRoute);
    app.use('/Api/v1/coupons', couponRoute);
    app.use('/Api/v1/cart', cartRoute);
    app.use('/Api/v1/orders', orderRoute);
}
