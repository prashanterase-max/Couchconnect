import { Router } from 'express';
import { submitVerification, getMyVerification } from '../controllers/verification.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);
router.get('/me', getMyVerification);
router.post('/', submitVerification);
export default router;
