import express from 'express';
import {
    createProduct,
    getProducts,
} from '../controllers/product.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/create', isLoggedIn, createProduct);
router.get('/', getProducts);

export default router;
