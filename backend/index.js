import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/db.js';
import cookieParser from 'cookie-parser';

import userRouter from './routes/auth.route.js';
import productRouter from './routes/product.route.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(
    cors({
        origin: process.env.BASE_URL,
        credentials: true,
        methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

db();

app.use('/api/desietsy/auth', userRouter);
app.use('/api/desietsy/product', productRouter);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
