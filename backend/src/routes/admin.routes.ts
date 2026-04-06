import { Router } from 'express';
import {
  getStats, listUsers, getUserDetails, updateUserStatus,
  listVerifications, bulkAction, getActivityFeed,
  listQuestions, deleteQuestion, deleteAnswer
} from '../controllers/admin.controller';
import { listReports, updateReportStatus } from '../controllers/report.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { requireRole } from '../middleware/role.middleware';

const router = Router();
router.use(authMiddleware, requireRole('admin'));

router.get('/stats', getStats);
router.get('/activity', getActivityFeed);
router.get('/users', listUsers);
router.get('/users/:id', getUserDetails);
router.patch('/users/:id', updateUserStatus);
router.post('/users/bulk', bulkAction);
router.get('/verifications', listVerifications);
router.get('/questions', listQuestions);
router.delete('/questions/:id', deleteQuestion);
router.delete('/questions/:id/answers/:answerId', deleteAnswer);
router.get('/reports', listReports);
router.patch('/reports/:id', updateReportStatus);

export default router;
