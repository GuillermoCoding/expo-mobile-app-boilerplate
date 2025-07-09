import { format, subDays, startOfDay, endOfDay } from 'date-fns';
import React, { useMemo } from 'react';
import { ScrollView, TouchableOpacity, Text, View } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { useStoolRecords } from '@/services/hooks/queries/useStoolRecords';

interface DateScrollerProps {
  selectedDate: Date | null;
  onDateSelect: (startDate: Date, endDate: Date, selectedDate: Date) => void;
}

export function DateScroller({ selectedDate, onDateSelect }: DateScrollerProps) {
  // Generate array of last 7 days
  const dates = useMemo(() => {
    const today = new Date();
    return Array.from({ length: 15 }, (_, i) => subDays(today, i));
  }, []);

  const { data: stoolRecords } = useStoolRecords();

  const dateHasRecordMap = useMemo(() => {
    const map = new Map<string, boolean>();
    
    dates.forEach(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      map.set(dateStr, stoolRecords?.some(record => 
        format(new Date(record.createdAt), 'yyyy-MM-dd') === dateStr
      ) ?? false);
    });

    return map;
  }, [dates, stoolRecords]);

  const hasStoolRecord = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return dateHasRecordMap.get(dateStr) ?? false;
  };

  const handleDateSelect = (date: Date) => {
    const start = startOfDay(date);
    const end = endOfDay(date);
    console.log('date', date);
    onDateSelect(start, end, date);
  };

  const isSelected = (date: Date) => {
    if (!selectedDate) return false;
    return format(date, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
  };

  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      className="px-4"
    >
      {dates.map((date) => (
        <TouchableOpacity
          key={date.toISOString()}
          onPress={() => handleDateSelect(date)}
          className="mx-2 items-center"
        >
          <View 
            className={twMerge(
              'w-8 h-8 items-center justify-center border border-gray-300 border-dashed rounded-full',
              hasStoolRecord(date) && 'border-amber-800 border-solid'
            )}
          >
            <Text 
              className={twMerge(
                'text-sm font-medium text-gray-600',
              )}
            >
              {format(date, 'EEE').charAt(0)}
            </Text>
          </View>
          <Text 
            className={twMerge(
              'mt-1 text-base text-gray-600',
              isSelected(date) && 'font-bold'
            )}
          >
            {format(date, 'd')}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}
