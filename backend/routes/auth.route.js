import express from 'express';
import {
    registerUser,
    verifyUser,
    loginUser,
} from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', registerUser);
router.get('/verify-email/:token', verifyUser);
router.post('/login', loginUser);

export default router;
