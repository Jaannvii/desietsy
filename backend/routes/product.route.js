import express from 'express';
import {
    createProduct,
    getProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    getCategories,
} from '../controllers/product.controller.js';
import { isLoggedIn, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/create', isLoggedIn, authorize('Artisan'), createProduct);
router.get('/categories', getCategories);
router.get('/', getProducts);
router.get('/:id', getProductById);
router.put('/:id', isLoggedIn, authorize('Artisan'), updateProduct);
router.delete('/:id', isLoggedIn, authorize('Admin', 'Artisan'), deleteProduct);

export default router;
