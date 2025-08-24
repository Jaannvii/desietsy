import express from 'express';
import {
    registerUser,
    verifyUser,
    loginUser,
    getMe,
    logoutUser,
    forgotPassword,
    resetPassword,
    getUserRole,
} from '../controllers/auth.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/verify-email/:token', verifyUser);
router.post('/login', loginUser);
router.get('/me', isLoggedIn, getMe);
router.get('/logout', isLoggedIn, logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.get('/role/:id', isLoggedIn, getUserRole);

export default router;
