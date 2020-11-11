const express = require('express');
const app = express();
const cors = require('cors')
const helmet = require('helmet')
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const compression = require('compression');
const hpp = require('hpp');

// ROUTERS
const productRouter = require('./routes/productRoutes');
const authRouter = require('./routes/authRoutes');
const userRouter = require('./routes/userRoutes');

app.use(compression());
app.use(cors());
app.options('*', cors());

// Secure http headers
app.use(helmet());
// Data sanitazation
app.use(xss());
app.use(cookieParser());

// Sanitize data against NoSQL query injection
app.use(mongoSanitize());

// Prevent parameter pollution (1 >) (ex: price=250, price=200)
app.use(
    hpp({
        whitelist: [
            'price',
            'name'
        ]
    })
);

// Serve static files
app.use('/uploads', express.static('uploads'))
// Body parser, reading data from the body into the req.body (limit 10kb)
app.use(express.json({ limit: '10kb' }));
// parse data from urlencoded form (files), {extended: true} = pass complex data
app.use(express.urlencoded({ extended: true }));

// ROUTES
app.use('/api/v1/products', productRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/user', userRouter);

module.exports = app;