import Ionicons from '@expo/vector-icons/Ionicons';
import { useQueryClient } from '@tanstack/react-query';
import * as ImagePicker from 'expo-image-picker';
import { useState } from 'react';
import { TouchableOpacity, Alert } from 'react-native';

import { supabase } from '@/config/supabase';
import { useAuth } from '@/services/auth/AuthContext';
import { uploadImageToS3 } from '@/services/aws/s3Service';
import { useAnalyzeStoolImage } from '@/services/hooks/mutations/useAnalyzeStoolImageMutation';
import { useCreateStoolRecord } from '@/services/hooks/mutations/useCreateStoolRecordMutation';
import { StoolRecord } from '@/types';

interface FloatingActionButtonProps {
  selectedDate: Date;
  onImageSelected?: (uri: string) => void;
}

export function FloatingActionButton({ onImageSelected, selectedDate }: FloatingActionButtonProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const createStoolRecord = useCreateStoolRecord();
  const analyzeStoolImage = useAnalyzeStoolImage();



  const handleImageUploadAndAnalysis = async (imageUri: string) => {
    if (!user) {
      Alert.alert('Error', 'User not authenticated');
      return;
    }

    // Double-check the session is still valid
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      Alert.alert('Error', 'Session expired. Please sign in again.');
      return;
    }

    const tempId = Date.now();
    setIsUploading(true);
    setProgress(0);
    
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

      // Create a temporary record immediately
      const tempRecord: StoolRecord = {
        id: tempId,
        imageUrl: imageUri, // Use local URI initially
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

      // Simulate progress updates for upload (0-30%)
      const uploadProgressInterval = setInterval(() => {
        setProgress(p => {
          const newProgress = Math.min(0.3, p + 0.05);
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
      }, 200);

      // Upload image to AWS S3 storage
      const { signedUrl: signedImageUrl } = await uploadImageToS3(imageUri, tempId);
      
      clearInterval(uploadProgressInterval);
      setProgress(0.4);

      // Update the temporary record with the uploaded image URL
      stoolRecordQueries.forEach(query => {
        queryClient.setQueryData(query.queryKey, (old: StoolRecord[] | undefined) => {
          if (!old) return old;
          return old.map(record => 
            record.id === tempId 
              ? { ...record, imageUrl: signedImageUrl, progress: 0.4 }
              : record
          );
        });
      });

      // Continue with analysis progress (40-90%)
      const analysisProgressInterval = setInterval(() => {
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

      // Analyze the image with AI using the signed URL
      const analysis = await analyzeStoolImage.mutateAsync(signedImageUrl);

      clearInterval(analysisProgressInterval);
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
        imageUrl: signedImageUrl,
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
      setIsUploading(false);
      
      // Call the original callback if provided
      onImageSelected?.(signedImageUrl);
      
    } catch (error) {
      setProgress(0);
      setIsUploading(false);
      Alert.alert('Error', 'Failed to upload image and create stool record');
      console.error('Upload error:', error);
      
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

  const pickImage = async () => {
    if (isUploading) {
      return; // Prevent multiple uploads
    }

    Alert.alert(
      "Upload Image",
      "Choose an option",
      [
        {
          text: "Take Photo",
          onPress: async () => {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Sorry, we need camera permissions to make this work!');
              return;
            }
            const result = await ImagePicker.launchCameraAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              await handleImageUploadAndAnalysis(result.assets[0].uri);
            }
          }
        },
        {
          text: "Choose from Library",
          onPress: async () => {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
              Alert.alert('Sorry, we need camera roll permissions to make this work!');
              return;
            }
            const result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ['images'],
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });

            if (!result.canceled) {
              await handleImageUploadAndAnalysis(result.assets[0].uri);
            }
          }
        },
        {
          text: "Cancel",
          style: "cancel"
        }
      ]
    );
  };

  return (
    <TouchableOpacity 
      onPress={pickImage}
      disabled={isUploading}
      className={`absolute bottom-6 right-6 w-14 h-14 rounded-full items-center justify-center shadow-lg ${isUploading ? 'bg-gray-500' : 'bg-black'}`}
    >
      <Ionicons name="add" size={24} color="white" />
    </TouchableOpacity>
  );
}