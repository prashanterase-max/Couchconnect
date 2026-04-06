import { Router } from 'express';
import { sendRequest, myRequests, localRequests, respondRequest } from '../controllers/stay.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);
router.post('/', sendRequest);
router.get('/my', myRequests);
router.get('/local', localRequests);
router.patch('/:id', respondRequest);
export default router;
