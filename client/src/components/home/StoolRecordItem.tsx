import React from 'react';
import { View, Text, Image } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { StoolRecord } from '@/types';

interface StoolRecordItemProps {
  record: StoolRecord;
  formatDate: (date: string) => string;
  isAnalyzing?: boolean;
  progress?: number;
}

export function StoolRecordItem({ record, formatDate, isAnalyzing, progress = 0 }: StoolRecordItemProps) {
  if (isAnalyzing) {
    const size = 60;
    const strokeWidth = 10;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const progressValue = Math.min(1, Math.max(0, progress));
    const strokeDashoffset = circumference * (1 - progressValue);

    return (
      <View className='flex-row p-4 m-2 bg-white rounded-lg shadow space-x-6'>
        <View className="items-center justify-center">
          <View className="relative items-center justify-center">
            <Svg width={size} height={size}>
              {/* Background circle */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#E5E7EB"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Progress circle */}
              <Circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke="#3B82F6"
                strokeWidth={strokeWidth}
                fill="none"
                strokeDasharray={`${circumference} ${circumference}`}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
              />
            </Svg>
            <View className="absolute items-center justify-center">
              <Text className="text-md font-bold">{Math.round(progress * 100)}%</Text>
            </View>
          </View>
        </View>
        <View className='flex-col justify-between mb-4'>
          <Text className='text-md font-bold'>Analyzing...</Text>
          <Text className="text-gray-500 mt-4">
            We'll notify you when done!
          </Text>
        </View>

      </View>
    );
  }

  return (
    <View className='p-4 m-2 bg-white rounded-lg shadow'>
      <View className='flex-row justify-between items-center mb-2'>
        <Text className='text-xl font-bold'>Type {record.bristolCategoryId}</Text>
        <Text className='text-sm text-gray-500'>{formatDate(record.createdAt)}</Text>
      </View>

      <View className='flex-row space-x-4 mb-2'>
        <Text className='text-gray-600'>Color: {record.bristolCategoryId}</Text>
        <Text className='text-gray-600'>Consistency: {record.bristolCategoryId}</Text>
      </View>

      {record.description && (
        <Text className='text-gray-600 mt-2'>{record.description}</Text>
      )}
    </View>
  );
} 