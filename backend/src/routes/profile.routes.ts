import { Router } from 'express';
import { getMyProfile, updateMyProfile, getProfileById, listProfiles } from '../controllers/profile.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);
router.get('/', listProfiles);
router.get('/me', getMyProfile);
router.put('/me', updateMyProfile);
router.get('/:userId', getProfileById);
export default router;
