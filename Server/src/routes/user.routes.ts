import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { getMe, updateMe } from '../controllers/user.controller';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);

router.get('/me', getMe);
router.patch('/update-me', updateMe);

export default router; 