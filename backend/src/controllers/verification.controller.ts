import { Response } from 'express';
import Verification from '../models/Verification';
import User from '../models/User';
import { AuthRequest } from '../middleware/auth.middleware';

// Simple string similarity (Dice coefficient)
function similarity(a: string, b: string): number {
  a = a.toLowerCase().replace(/\s+/g, ' ').trim();
  b = b.toLowerCase().replace(/\s+/g, ' ').trim();
  if (a === b) return 1;
  if (a.length < 2 || b.length < 2) return 0;
  const getBigrams = (s: string) => {
    const bigrams = new Set<string>();
    for (let i = 0; i < s.length - 1; i++) bigrams.add(s[i] + s[i + 1]);
    return bigrams;
  };
  const aB = getBigrams(a), bB = getBigrams(b);
  let intersection = 0;
  aB.forEach(bg => { if (bB.has(bg)) intersection++; });
  return (2 * intersection) / (aB.size + bB.size);
}

export const submitVerification = async (req: AuthRequest, res: Response) => {
  try {
    const { submittedName, documentImage } = req.body;
    if (!documentImage) return res.status(400).json({ message: 'Document image required' });

    // OCR via tesseract
    let ocrText = '';
    try {
      const Tesseract = require('tesseract.js');
      const base64Data = documentImage.replace(/^data:image\/\w+;base64,/, '');
      const buffer = Buffer.from(base64Data, 'base64');
      const result = await Tesseract.recognize(buffer, 'eng');
      ocrText = result.data.text;
    } catch {
      ocrText = '';
    }

    const conf = similarity(submittedName, ocrText);
    let status: 'pending' | 'approved' | 'rejected' = 'rejected';
    if (conf >= 0.9) status = 'approved';
    else if (conf >= 0.6) status = 'pending';

    const v = await Verification.findOneAndUpdate(
      { userId: req.userId },
      { submittedName, documentImage, ocrText, confidence: conf, status },
      { upsert: true, new: true }
    );

    if (status === 'approved') {
      await User.findByIdAndUpdate(req.userId, { isVerified: true, verificationStatus: 'approved' });
    } else {
      await User.findByIdAndUpdate(req.userId, { verificationStatus: status });
    }

    res.json({ status, confidence: conf, verification: v });
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};

export const getMyVerification = async (req: AuthRequest, res: Response) => {
  try {
    const v = await Verification.findOne({ userId: req.userId });
    res.json(v);
  } catch (err: any) {
    res.status(500).json({ message: err.message });
  }
};
