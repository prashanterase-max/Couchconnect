import { Router } from 'express';
import { reportUser } from '../controllers/report.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);
router.post('/', reportUser);
export default router;
