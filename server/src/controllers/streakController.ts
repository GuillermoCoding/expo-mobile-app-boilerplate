import { startOfWeek, endOfWeek } from 'date-fns';
import { Request, Response } from 'express';

import { getStreak as getStreakService, updateStreakRecord, getStreakDays } from '@/services/streakService';
import { StreakResponse } from '@/types/streak';

export const getStreak = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.userId || isNaN(req.userId)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const today = new Date();
    const startDate = startOfWeek(today);
    const endDate = endOfWeek(today);

    const streaks = await getStreakService(req.userId);
    const streakDays = await getStreakDays(req.userId, startDate, endDate);
    
    if (!streaks || streaks.length === 0) {
      return res.json([]);
    }

    // Attach streak days to each streak
    const streaksWithDays = streaks.map(streak => ({
      ...streak,
      streakDays: streakDays.filter(day => day.streakId === streak.id)
    }));

    return res.json(streaksWithDays);
  } catch (error) {
    console.error('Error getting streak:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateStreak = async (req: Request, res: Response): Promise<Response> => {
  try {
    if (!req.userId || isNaN(req.userId)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const updatedStreak = await updateStreakRecord(req.userId);
    
    // Get all streaks to return the complete state
    const allStreaks = await getStreakService(req.userId);
    const today = new Date();
    const streakDays = await getStreakDays(req.userId, startOfWeek(today), endOfWeek(today));
    
    const streaksWithDays = allStreaks.map(streak => ({
      ...streak,
      streakDays: streakDays.filter(day => day.streakId === streak.id)
    }));

    return res.json(streaksWithDays);
  } catch (error) {
    console.error('Error updating streak:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};