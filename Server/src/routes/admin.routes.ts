import express from 'express';
import { protect, restrictTo } from '../middleware/auth.middleware';
import {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  getAllQuestionnaires
} from '../controllers/admin.controller';

const router = express.Router();

// Protect all routes after this middleware
router.use(protect);
router.use(restrictTo('admin'));

router.route('/users').get(getAllUsers);
router.route('/users/:id').get(getUser).patch(updateUser).delete(deleteUser);
router.route('/questionnaires').get(getAllQuestionnaires);

export default router;