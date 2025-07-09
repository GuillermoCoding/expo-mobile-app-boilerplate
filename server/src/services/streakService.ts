import { startOfDay, differenceInDays } from 'date-fns';

import { prisma } from '@/utils/prisma';

export async function getStreak(userId: number) {
  return prisma.streak.findMany({
    where: { userId },
    include: {
      streakDays: true
    }
  });
}

export async function createStreak(userId: number, date: Date) {
  const today = startOfDay(date);
  return prisma.streak.create({
    data: {
      userId,
      currentStreak: 1,
      longestStreak: 1,
      lastRecordDate: today,
      streakDays: {
        create: {
          date: today
        }
      }
    },
    include: {
      streakDays: true
    }
  });
}

export async function updateStreakRecord(userId: number) {
  const today = startOfDay(new Date());
  const streaks = await getStreak(userId);

  // Find the most recent streak
  const activeStreak = streaks.find(streak => {
    const lastRecordDate = startOfDay(streak.lastRecordDate);
    const daysDifference = differenceInDays(today, lastRecordDate);
    return daysDifference <= 1; // Active if recorded today or yesterday
  });

  // If there's an active streak and it was updated today, no change needed
  if (activeStreak) {
    const daysDifference = differenceInDays(today, startOfDay(activeStreak.lastRecordDate));
    
    if (daysDifference === 0) {
      // Already recorded today, just return the current streak
      return activeStreak;
    }

    if (daysDifference === 1) {
      // Recorded yesterday, update the current streak
      return prisma.streak.update({
        where: { id: activeStreak.id },
        data: {
          currentStreak: activeStreak.currentStreak + 1,
          longestStreak: Math.max(activeStreak.currentStreak + 1, activeStreak.longestStreak),
          lastRecordDate: today,
          streakDays: {
            create: {
              date: today
            }
          }
        },
        include: {
          streakDays: true
        }
      });
    }
  }

  // If no active streak or streak broken (more than 1 day passed), create a new one
  return createStreak(userId, today);
}

export async function getStreakDays(userId: number, startDate: Date, endDate: Date) {
  const streaks = await prisma.streak.findMany({
    where: { 
      userId,
      streakDays: {
        some: {
          date: {
            gte: startDate,
            lte: endDate
          }
        }
      }
    },
    include: {
      streakDays: {
        where: {
          date: {
            gte: startDate,
            lte: endDate
          }
        }
      }
    }
  });

  // Combine all streak days from all streaks into a single array
  const allStreakDays = streaks.flatMap(streak => streak.streakDays);
  return allStreakDays;
} 