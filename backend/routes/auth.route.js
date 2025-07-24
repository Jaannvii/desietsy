import express from 'express';
import {
    registerUser,
    verifyUser,
    loginUser,
    getMe,
    logoutUser,
    forgotPassword,
    resetPassword,
    changePassword,
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
router.post('/change-password', isLoggedIn, changePassword);

export default router;
