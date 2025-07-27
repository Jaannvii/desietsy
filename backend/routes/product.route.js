import express from 'express';
import {
    createProduct,
    getProducts,
} from '../controllers/product.controller.js';
import { isLoggedIn, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/create', isLoggedIn, authorize('Artisan'), createProduct);
router.get('/', isLoggedIn, getProducts);

export default router;
