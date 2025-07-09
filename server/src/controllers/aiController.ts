import { Request, Response } from 'express';

import { analyzeStoolImage } from '@/services/aiService';
import { Logger } from '@/utils/logger';

export const analyzeStoolImageWithAI = async (req: Request, res: Response) => {
  const userId = req.userId;
  const { imageUrl } = req.body;

  if (!userId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  if (!imageUrl) {
    return res.status(400).json({ error: 'imageUrl is required' });
  }

  try {
    const analysis = await analyzeStoolImage(imageUrl);
    return res.status(200).json(analysis);
  } catch (error) {
    Logger.error('Error analyzing stool image:', error);
    return res.status(500).json({ error: 'Error analyzing stool image' });
  }
}; 