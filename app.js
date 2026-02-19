/* eslint-disable import/no-extraneous-dependencies */
const dotEnv = require('dotenv');

dotEnv.config({ path: 'config.env' });

const express = require('express');
const morgan = require('morgan');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
// eslint-disable-next-line import/no-extraneous-dependencies
const compression = require('compression');
// eslint-disable-next-line import/no-extraneous-dependencies
const { rateLimit } = require('express-rate-limit');
// eslint-disable-next-line import/no-extraneous-dependencies
const helmet = require('helmet');
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoSanitize = require('express-mongo-sanitize');
// eslint-disable-next-line import/no-unresolved, node/no-missing-require
const { xss } = require('express-xss-sanitizer');
const hpp = require('hpp');

const dbConnection = require('./config/database');
const apiError = require('./utils/apiError');
const globalErrorHandling = require('./middlewares/errors');
const mountRoutes = require('./routes/index');
const { webhookCheckout } = require('./controllers/order');

const app = express();
app.use(cors());
app.options(/(\/.*)/, cors());
app.use(compression());
const { PORT } = process.env;

app.post(
    '/webhook-checkout',
    express.raw({ type: 'application/json' }),
    webhookCheckout
);

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(express.json({ limit: '20kb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'uploads'))); // to access images from browser
app.set('query parser', 'extended');

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

app.use(mongoSanitize());
app.use(xss());

app.use(hpp({
    whitelist: [
        'price',
        'sold',
        'quantity',
        'ratingsAverage',
        'ratingsQuantity',
        'category',
        'brand'
    ]
}));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    message: { error: 'Too many requests, please try again later.' },
});

app.use('/Api', limiter);

mountRoutes(app);

app.all(/(\/.*)/, (req, res, next) => {
    next(new apiError(`Can't find this route: ${req.originalUrl}`, 400));
});

app.use(globalErrorHandling); 

let server;
process.on('unhandledRejection', (err) => {
    console.log(`UnhandledRejection Error: ${err}`);
    server.close(() => {
        process.exit(1); 
    });
});

dbConnection()
    .then(() => {
        server = app.listen(PORT, () => {
            console.log(`App running on port ${PORT}`);
        });
    })
    .catch((err) => {
        console.error('DB connection error:', err);
        process.exit(1);
    });