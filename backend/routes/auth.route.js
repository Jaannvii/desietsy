import express from 'express';
import { registerUser } from '../controllers/auth.controller.js';
import { users} from '../controllers/user.controller.js';
import {verifyId} from '../controllers/verify.controller.js';
const router = express.Router();

router.post('/register', registerUser);
router.get('/users', users);
router.put('/verify/id', verifyId);

export default router;
