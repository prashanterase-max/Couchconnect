import { Router } from 'express';
import { getMessages, sendMessage, markSeen, getInbox } from '../controllers/chat.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);
router.get('/inbox', getInbox);
router.get('/:chatId', getMessages);
router.post('/:chatId', sendMessage);
router.post('/:chatId/seen', markSeen);
export default router;
