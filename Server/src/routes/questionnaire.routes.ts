import express from 'express';
import { submitQuestionnaire, getAnalytics } from '../controllers/questionnaire.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', submitQuestionnaire);
router.get('/analytics', protect, restrictTo('admin'), getAnalytics);

export default router; 