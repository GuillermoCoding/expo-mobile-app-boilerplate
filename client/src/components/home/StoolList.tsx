import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';

import { StoolRecordItem } from '@/components/home/StoolRecordItem';
import { useStoolRecords } from '@/services/hooks/queries/useStoolRecords';
import { StoolRecord } from '@/types';
import { RootStackParamList } from '@/types/navigation';

interface StoolListProps {
  selectedDate: Date | null;
}

export function StoolList({ selectedDate }: StoolListProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const getDateRange = (date: Date) => {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return {
      startDate: startOfDay.toISOString(),
      endDate: endOfDay.toISOString(),
    };
  };

  const dateRange = selectedDate ? getDateRange(selectedDate) : null;

  const {
    isLoading,
    error,
    data: stoolRecords = [],
  } = useStoolRecords({
    startDate: dateRange?.startDate,
    endDate: dateRange?.endDate,
  });

  const formatDate = (date: string) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  const handleRecordPress = (record: StoolRecord) => {
    navigation.navigate('StoolRecordDetails', { record, id: record.id });
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl">Loading...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-xl text-red-600">Error: {error.message}</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={stoolRecords}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity onPress={() => handleRecordPress(item)} disabled={item.isAnalyzing}>
          <StoolRecordItem 
            record={item} 
            formatDate={formatDate}
            isAnalyzing={item.isAnalyzing}
            progress={item.progress}
          />
        </TouchableOpacity>
      )}
      ListEmptyComponent={() => (
        <View className="flex-1 items-center justify-center p-4">
          <Text className="text-gray-500 text-center">
            No records for this date
          </Text>
        </View>
      )}
    />
  );
}
