import express from 'express';
import {
    getProfile,
    updateProfile,
    deleteArtisan,
} from '../controllers/artisan.controller.js';
import { isLoggedIn, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();
router.get('/me', isLoggedIn, authorize('Artisan'), getProfile);
router.put('/profile', isLoggedIn, authorize('Artisan'), updateProfile);
router.delete('/delete/:id', isLoggedIn, authorize('Admin'), deleteArtisan);

export default router;
