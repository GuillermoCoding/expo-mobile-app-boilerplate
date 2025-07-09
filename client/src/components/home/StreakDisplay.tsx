import { format, startOfWeek, eachDayOfInterval, endOfWeek, isToday } from 'date-fns';
import React from 'react';
import { View, Text } from 'react-native';

import { useStreak } from '@/services/hooks/queries/useStreak';

export const StreakDisplay = () => {
  const { data: streaks = [], isLoading } = useStreak();

  const today = new Date();
  const startOfWeekDate = startOfWeek(today);
  const endOfWeekDate = endOfWeek(today);
  
  // Find the current active streak (if any)
  const currentStreak = streaks.find((streak) => {
    const lastRecordDate = new Date(streak.lastRecordDate);
    return isToday(lastRecordDate) || format(lastRecordDate, 'yyyy-MM-dd') === format(today, 'yyyy-MM-dd');
  });
  
  const weekDays = eachDayOfInterval({
    start: startOfWeekDate,
    end: endOfWeekDate
  }).map(date => {
    const formattedDate = format(date, 'yyyy-MM-dd');
    
    // Check if this date appears in any streak's days
    const isActive = streaks.some((streak) => 
      streak.streakDays?.some((day) =>
        format(new Date(day.date), 'yyyy-MM-dd') === formattedDate
      )
    );

    return {
      date,
      label: format(date, 'EEEEE'),
      isToday: formattedDate === format(today, 'yyyy-MM-dd'),
      isActive: !!isActive
    };
  });

  if (isLoading) {
    return (
      <View className="p-4">
        <Text>Loading...</Text>
      </View>
    );
  }

  return (
    <View className="bg-white p-6 rounded-lg shadow-sm mx-4 my-2">
      <View className="items-center mb-4">
        <View className="bg-orange-100 p-3 rounded-full mb-2">
          <Text className="text-3xl">🔥</Text>
        </View>
        <Text className="text-2xl font-bold text-orange-500">
          {currentStreak?.currentStreak || 0}
        </Text>
        <Text className="text-lg text-gray-600">Day streak</Text>
      </View>

      <View className="flex-row justify-between mt-4">
        {weekDays.map((day, index) => (
          <View key={index} className="items-center">
            <Text className={`text-sm ${day.isToday ? 'text-orange-500 font-bold' : 'text-gray-600'}`}>
              {day.label}
            </Text>
            <View 
              className={`w-8 h-8 rounded-full mt-1 items-center justify-center
                ${day.isActive ? 'bg-orange-500' : 'bg-gray-200'}`}
            >
              {day.isActive && (
                <Text className="text-white">✓</Text>
              )}
            </View>
          </View>
        ))}
      </View>

      <Text className="text-center mt-4 text-gray-600">
        You're on fire! Every day matters for hitting your goal!
      </Text>
    </View>
  );
}; 