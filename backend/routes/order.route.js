import express from 'express';
import {
    createOrder,
    getOrders,
    getOrderById,
    updateOrderStatus,
    deleteOrder,
} from '../controllers/order.controller.js';
import { isLoggedIn, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/create', isLoggedIn, createOrder);
router.get('/', isLoggedIn, getOrders);
router.get('/:id', isLoggedIn, getOrderById);
router.put('/:id/status', isLoggedIn, authorize('Admin'), updateOrderStatus);
router.delete('/:id', isLoggedIn, authorize('Admin'), deleteOrder);

export default router;
