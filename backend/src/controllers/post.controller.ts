import { Response } from 'express';
import Post from '../models/Post';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';
import mongoose from 'mongoose';
import { createNotification } from './notification.controller';

export const createPost = async (req: AuthRequest, res: Response) => {
  try {
    const { image, caption } = req.body;
    if (!image) return res.status(400).json({ message: 'Image required' });
    const post = await Post.create({ userId: req.userId, image, caption });
    res.json(post);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getUserPosts = async (req: AuthRequest, res: Response) => {
  try {
    const posts = await Post.find({ userId: req.params.userId }).sort({ createdAt: -1 }).lean();
    res.json(posts);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyPosts = async (req: AuthRequest, res: Response) => {
  try {
    const posts = await Post.find({ userId: req.userId }).sort({ createdAt: -1 }).lean();
    res.json(posts);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deletePost = async (req: AuthRequest, res: Response) => {
  try {
    await Post.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    res.json({ message: 'Deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const toggleLike = async (req: AuthRequest, res: Response) => {
  try {
    const uid = new mongoose.Types.ObjectId(req.userId);
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const liked = post.likes.some(l => l.equals(uid));
    if (liked) {
      post.likes = post.likes.filter(l => !l.equals(uid));
    } else {
      post.likes.push(uid);
      if (String(post.userId) !== req.userId) {
        const liker = await User.findById(req.userId).select('name').lean();
        await createNotification(
          String(post.userId), 'rating',
          `❤️ ${(liker as any)?.name || 'Someone'} liked your photo`,
          post.caption ? `"${post.caption.slice(0, 40)}"` : 'View photo',
          `/profile/${post.userId}`
        );
      }
    }
    await post.save();
    res.json({ likes: post.likes.length, liked: !liked });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;
    if (!text?.trim()) return res.status(400).json({ message: 'Comment text required' });
    const user = await User.findById(req.userId).select('name').lean();
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    post.comments.push({
      userId: new mongoose.Types.ObjectId(req.userId),
      userName: (user as any)?.name || 'User',
      text: text.trim(),
      createdAt: new Date(),
    });
    await post.save();

    if (String(post.userId) !== req.userId) {
      await createNotification(
        String(post.userId), 'message',
        `💬 ${(user as any)?.name || 'Someone'} commented on your photo`,
        text.trim().slice(0, 60),
        `/profile/${post.userId}`
      );
    }

    res.json(post.comments[post.comments.length - 1]);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response) => {
  try {
    await Post.findByIdAndUpdate(req.params.id, {
      $pull: { comments: { _id: req.params.commentId, userId: req.userId } }
    });
    res.json({ message: 'Comment deleted' });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
