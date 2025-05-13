import express from 'express';
import { submitQuestionnaire, getAnalytics } from '../controllers/questionnaire.controller';

const router = express.Router();

router.post('/', submitQuestionnaire);
router.get('/analytics', getAnalytics);

export default router; 