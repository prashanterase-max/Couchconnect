import { Router } from 'express';
import { getNotifications, markAllRead, markRead } from '../controllers/notification.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);
router.get('/', getNotifications);
router.post('/read-all', markAllRead);
router.post('/:id/read', markRead);
export default router;
