import { Response } from 'express';
import Question from '../models/Question';
import { AuthRequest } from '../middleware/auth.middleware';

export const createQuestion = async (req: AuthRequest, res: Response) => {
  try {
    const { title, body, city } = req.body;
    const q = await Question.create({ authorId: req.userId, title, body, city });
    res.json(q);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const listQuestions = async (req: AuthRequest, res: Response) => {
  try {
    const filter: any = {};
    if (req.query.city) filter.city = req.query.city;
    const questions = await Question.find(filter).populate('authorId', 'name').sort({ createdAt: -1 });
    res.json(questions);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const addAnswer = async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;
    const q = await Question.findById(req.params.id);
    if (!q) return res.status(404).json({ message: 'Question not found' });
    q.answers.push({ authorId: req.userId as any, text, createdAt: new Date() });
    await q.save();
    res.json(q);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
