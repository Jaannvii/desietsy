import express from 'express';
import { updateProfile } from '../controllers/artisan.controller.js';
import { isLoggedIn, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();
router.put('/profile', isLoggedIn, authorize('Artisan'), updateProfile);

export default router;
