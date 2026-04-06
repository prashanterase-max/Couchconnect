import { Router } from 'express';
import { createPost, getUserPosts, getMyPosts, deletePost, toggleLike, addComment, deleteComment } from '../controllers/post.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = Router();
router.use(authMiddleware);

router.post('/', createPost);
router.get('/me', getMyPosts);
router.get('/user/:userId', getUserPosts);
router.delete('/:id', deletePost);
router.post('/:id/like', toggleLike);
router.post('/:id/comment', addComment);
router.delete('/:id/comment/:commentId', deleteComment);

export default router;
