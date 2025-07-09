import { useState } from 'react';
import { View, Text } from 'react-native';

import { DateScroller } from '@/components/home/DateScroller';
import { StoolList } from '@/components/home/StoolList';
import { FloatingActionButton } from '@/components/home/FloatingActionButton';
import { useAuth } from '@/services/auth/AuthContext';

export function HomeScreen() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const { loading } = useAuth();

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      <View className="h-24 bg-white border-b border-gray-200">
        <DateScroller selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      </View>
      <View className="flex-1">
        <StoolList selectedDate={selectedDate} />
      </View>
      <FloatingActionButton onImageSelected={() => {}} selectedDate={selectedDate} />
    </View>
  );
}