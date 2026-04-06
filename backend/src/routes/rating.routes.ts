import { Router } from 'express';
import { submitRating, getRatings } from '../controllers/rating.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);
router.post('/', submitRating);
router.get('/:userId', getRatings);
export default router;
