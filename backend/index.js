import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/db.js';
import cookieParser from 'cookie-parser';

import userRouter from './routes/auth.route.js';
import artisanRouter from './routes/artisan.route.js';
import productRouter from './routes/product.route.js';
import orderRouter from './routes/order.route.js';
import adminRouter from './routes/admin.route.js';

import passport from 'passport';
import './config/passport.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(
    cors({
        origin: ['https://desi-etsy-delta.vercel.app', 'http://localhost:5173'],
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header(
        'Access-Control-Allow-Origin',
        'https://desi-etsy-delta.vercel.app'
    );
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization'
    );
    next();
});

db();

app.use('/api/desietsy/auth', userRouter);
app.use('/api/desietsy/artisan', artisanRouter);
app.use('/api/desietsy/product', productRouter);
app.use('/api/desietsy/order', orderRouter);
app.use('/api/desietsy/admin', adminRouter);

app.get(
    '/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);
app.get(
    '/auth/google/callback',
    passport.authenticate('google', { session: false }),
    (req, res) => {
        const token = req.user.token;
        res.redirect(`${process.env.FRONTEND_URL}/products?token=${token}`);
    }
);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
