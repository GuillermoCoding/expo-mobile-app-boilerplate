import { Streak as PrismaStreak, StreakDay as PrismaStreakDay } from '@prisma/client';

export interface StreakResponse extends PrismaStreak {
  streakDays: PrismaStreakDay[];
}