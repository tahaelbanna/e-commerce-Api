const dns = require('node:dns');

dns.setDefaultResultOrder('ipv4first');
// importing  packs
const dotEnv = require('dotenv');

// Load environment variables FIRST
dotEnv.config({ path: 'config.env' });

const express = require('express');
const morgan = require('morgan');
const path = require('path');
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require('cors');
// eslint-disable-next-line import/no-extraneous-dependencies
const compression = require('compression');

// importing my files
const dbConnection = require('./config/database');
const apiError = require('./utils/apiError');
const globalErrorHandling = require('./middlewares/errors');
const mountRoutes = require('./routes/index');
const { webhookCheckout } = require('./controllers/order');

// configerations
const app = express();
app.use(cors());
app.options(/(\/.*)/, cors());
app.use(compression());
const { PORT } = process.env;

//  Webhook Route
app.post(
    '/webhook-checkout',
    express.raw({ type: 'application/json' }),
    webhookCheckout
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'uploads'))); // to access images from browser
app.set('query parser', 'extended');

// middleWares
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}
console.log('lol1');
mountRoutes(app);
console.log('lol2');

app.all(/(\/.*)/, (req, res, next) => {
    next(new apiError(`Can't find this route: ${req.originalUrl}`, 400));
});

app.use(globalErrorHandling); // for express errors

let server;
process.on('unhandledRejection', (err) => {
    // for any thing errors except express
    console.log(`UnhandledRejection Error: ${err}`);
    server.close(() => {
        process.exit(1); // علشان لو لسه في عمليات بيندنج
    });
});

// programe running
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
