import express from 'express';
import {
    getAllArtisans,
    verifyArtisan,
    getAllProducts,
    approveProduct,
    getAllOrders,
} from '../controllers/admin.controller.js';
import { isLoggedIn, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();
router.get('/artisans', isLoggedIn, authorize('Admin'), getAllArtisans);
router.put(
    '/verify-artisan/:id',
    isLoggedIn,
    authorize('Admin'),
    verifyArtisan
);
router.get('/products', isLoggedIn, authorize('Admin'), getAllProducts);
router.put(
    '/approve-product/:id',
    isLoggedIn,
    authorize('Admin'),
    approveProduct
);
router.get('/orders', isLoggedIn, authorize('Admin'), getAllOrders);

export default router;
