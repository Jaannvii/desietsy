import express from 'express';
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from '../controllers/product.controller.js';
import { isLoggedIn, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/create', isLoggedIn, authorize('Artisan'), createProduct);
router.get('/', isLoggedIn, getProducts);
router.get('/:id', isLoggedIn, getProductById);
router.put('/:id', isLoggedIn, authorize('Artisan'), updateProduct);
router.delete('/:id', isLoggedIn, authorize('Admin', 'Artisan'), deleteProduct);

export default router;
