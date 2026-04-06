import { Router } from 'express';
import { createQuestion, listQuestions, addAnswer } from '../controllers/question.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);
router.get('/', listQuestions);
router.post('/', createQuestion);
router.post('/:id/answer', addAnswer);
export default router;
