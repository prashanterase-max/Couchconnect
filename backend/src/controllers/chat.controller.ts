import { Response } from 'express';
import mongoose from 'mongoose';
import Chat from '../models/Chat';
import Profile from '../models/Profile';
import { AuthRequest } from '../middleware/auth.middleware';

const buildChatId = (a: string, b: string) => [a, b].sort().join('_');

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const chatId = req.params.chatId as string;
    const chat = await Chat.findOne({ chatId });
    res.json(chat?.messages || []);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;
    const chatId = req.params.chatId as string;
    const parts = chatId.split('_');
    if (parts.length !== 2) return res.status(400).json({ message: 'Invalid chatId' });

    let chat = await Chat.findOne({ chatId });
    if (!chat) {
      chat = await Chat.create({
        chatId,
        participants: parts.map(id => new mongoose.Types.ObjectId(id)),
        messages: [],
      });
    }
    const msg = { senderId: new mongoose.Types.ObjectId(req.userId), text, seenBy: [new mongoose.Types.ObjectId(req.userId)], createdAt: new Date() };
    chat.messages.push(msg as any);
    await chat.save();
    res.json(chat.messages[chat.messages.length - 1]);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const markSeen = async (req: AuthRequest, res: Response) => {
  try {
    const chatId = req.params.chatId as string;
    const uid = new mongoose.Types.ObjectId(req.userId);
    await Chat.updateOne(
      { chatId },
      { $addToSet: { 'messages.$[].seenBy': uid } }
    );
    res.json({ ok: true });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getInbox = async (req: AuthRequest, res: Response) => {
  try {
    const uid = req.userId as string;
    const chats = await Chat.find({ chatId: new RegExp(uid) });
    const inbox = await Promise.all(chats.map(async chat => {
      const otherId = chat.participants.find(p => String(p) !== uid);
      const profile = otherId ? await Profile.findOne({ userId: otherId }).select('name photo') : null;
      const unread = chat.messages.filter(m =>
        String(m.senderId) !== uid && !m.seenBy.map(String).includes(uid)
      ).length;
      const last = chat.messages[chat.messages.length - 1];
      return { chatId: chat.chatId, otherId, otherName: profile?.name || 'User', otherPhoto: profile?.photo || '', unread, lastMessage: last?.text || '', lastAt: last?.createdAt };
    }));
    res.json(inbox);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
