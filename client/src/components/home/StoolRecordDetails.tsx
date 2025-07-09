import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

import { useUpdateStoolRecordMutation } from '@/services/hooks/mutations/useUpdateStoolRecordMutation';
import { StoolRecord } from '@/types';
import { RootStackParamList } from '@/types/navigation';

type Props = NativeStackScreenProps<RootStackParamList, 'StoolRecordDetails'>;

export function StoolRecordDetails({ route, navigation }: Props) {
  const { record } = route.params;
  const [notes, setNotes] = useState(record.description || '');
  const updateMutation = useUpdateStoolRecordMutation();

  const handleSave = async () => {
    try {
      await updateMutation.mutateAsync({
        id: record.id,
        description: notes,
      });
      navigation.goBack();
    } catch (error) {
      console.error('Error updating stool record:', error);
    }
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-4">Record Details</Text>
        
        <View className="bg-gray-50 rounded-lg p-4 mb-4">
          <Text className="text-lg mb-2">
            Date: {new Date(record.createdAt).toLocaleString()}
          </Text>
          <Text className="text-lg mb-2">
            Type: {record.bristolCategoryId}
          </Text>
          
          <Text className="text-lg mb-2">Notes:</Text>
          <TextInput
            className="bg-white p-3 rounded-lg border border-gray-200 min-h-[100px]"
            multiline
            value={notes}
            onChangeText={setNotes}
            placeholder="Add notes about this record..."
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      <View className="p-4 border-t border-gray-200">
        <TouchableOpacity
          className="bg-blue-500 p-4 rounded-lg items-center"
          onPress={handleSave}
          disabled={updateMutation.isPending}
        >
          {updateMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg">Save</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
} 