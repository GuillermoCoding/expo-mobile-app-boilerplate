import Ionicons from '@expo/vector-icons/Ionicons';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { TouchableOpacity, Alert } from 'react-native';

import { useAnalyzeStoolImage } from '@/services/hooks/mutations/useAnalyzeStoolImageMutation';
import { useCreateStoolRecord } from '@/services/hooks/mutations/useCreateStoolRecordMutation';
import { StoolRecord } from '@/types';

interface TestActionButtonProps {
  onImageSelected?: (uri: string) => void;
  selectedDate?: Date;
}

export function TestActionButton({ onImageSelected, selectedDate }: TestActionButtonProps) {
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();
  const createStoolRecord = useCreateStoolRecord();
  const analyzeStoolImage = useAnalyzeStoolImage();

  const handlePress = async () => {
    const tempId = Date.now();
    
    try {
      let timestamp: string;

      if (selectedDate) {
        const now = new Date();
        const dateToUse = new Date(selectedDate);
        dateToUse.setHours(now.getHours(), now.getMinutes(), now.getSeconds(), now.getMilliseconds());
        timestamp = dateToUse.toISOString();
      } else {
        timestamp = new Date().toISOString();
      }

      const userUploadedImage = 'https://c8.alamy.com/comp/W3C8MW/close-up-of-ground-with-dirt-and-sand-soil-in-random-with-small-stones-randomly-sketched-dirty-loose-coarse-sand-interspersed-with-debris-and-small-g-W3C8MW.jpg';
      
      // Create a temporary record immediately
      const tempRecord: StoolRecord = {
        id: tempId,
        imageUrl: userUploadedImage,
        description: '',
        bristolCategoryId: 0,
        createdAt: timestamp,
        updatedAt: timestamp,
        userId: 0, // This will be set by the server
        isAnalyzing: true,
        progress: 0
      };

      // Get all stool-records queries from the cache
      const queryCache = queryClient.getQueryCache();
      const stoolRecordQueries = queryCache.findAll({
        predicate: query => query.queryKey[0] === 'stool-records'
      });

      // Update all stool-records queries to include the temporary record
      stoolRecordQueries.forEach(query => {
        const data = query.state.data as StoolRecord[] | undefined;
        if (data) {
          queryClient.setQueryData(query.queryKey, [tempRecord, ...data]);
        }
      });
      
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setProgress(p => {
          const newProgress = Math.min(0.9, p + 0.1);
          // Update the temporary record's progress in all queries
          stoolRecordQueries.forEach(query => {
            queryClient.setQueryData(query.queryKey, (old: StoolRecord[] | undefined) => {
              if (!old) return old;
              return old.map(record => 
                record.id === tempId 
                  ? { ...record, progress: newProgress }
                  : record
              );
            });
          });
          return newProgress;
        });
      }, 500);

      // Analyze the image with AI
      const analysis = await analyzeStoolImage.mutateAsync(userUploadedImage);

      clearInterval(progressInterval);
      setProgress(1);
      
      // Update the temporary record's progress one last time
      stoolRecordQueries.forEach(query => {
        queryClient.setQueryData(query.queryKey, (old: StoolRecord[] | undefined) => {
          if (!old) return old;
          return old.map(record => 
            record.id === tempId 
              ? { ...record, progress: 1 }
              : record
          );
        });
      });

      // Create the actual record with the AI analysis
      await createStoolRecord.mutateAsync({
        imageUrl: userUploadedImage,
        description: analysis.description,
        bristolCategoryId: analysis.bristolCategoryId,
        createdAt: timestamp,
        notes: analysis.observations,
        recommendations: analysis.recommendations
      });

      // Remove the temporary record from all queries
      stoolRecordQueries.forEach(query => {
        queryClient.setQueryData(query.queryKey, (old: StoolRecord[] | undefined) => {
          if (!old) return old;
          return old.filter(record => record.id !== tempId);
        });
      });

      setProgress(0);
    } catch (error) {
      setProgress(0);
      Alert.alert('Error', 'Failed to create stool record');
      
      // Remove the temporary record from all queries in case of error
      const stoolRecordQueries = queryClient.getQueryCache().findAll({
        predicate: query => query.queryKey[0] === 'stool-records'
      });
      stoolRecordQueries.forEach(query => {
        queryClient.setQueryData(query.queryKey, (old: StoolRecord[] | undefined) => {
          if (!old) return old;
          return old.filter(record => record.id !== tempId);
        });
      });
    }
  };

  return (
    <TouchableOpacity 
      onPress={handlePress}
      className="absolute bottom-6 right-6 w-14 h-14 bg-black rounded-full items-center justify-center shadow-lg"
    >
      <Ionicons name="add" size={24} color="white" />
    </TouchableOpacity>
  );
}