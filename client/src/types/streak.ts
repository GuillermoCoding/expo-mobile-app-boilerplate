export interface StreakDay {
  id: number;
  date: string;
  streakId: number;
  createdAt: string;
  updatedAt: string;
}

export interface Streak {
  id: number;
  userId: number;
  currentStreak: number;
  longestStreak: number;
  lastRecordDate: string;
  createdAt: string;
  updatedAt: string;
  streakDays: StreakDay[];
}

export type ApiResponse<T> = T | { error: string }; 