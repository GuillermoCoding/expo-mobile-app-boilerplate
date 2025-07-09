import Ionicons from '@expo/vector-icons/Ionicons';
import { useState } from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

import { StreakDisplay } from '@/components/home/StreakDisplay';

export function HomeHeader() {
  const [isStreakModalOpen, setIsStreakModalOpen] = useState(false);

  return (
    <View className="pt-12 pb-4 bg-blue-600">
      <Modal
        animationType="fade"
        transparent={true}
        visible={isStreakModalOpen}
        onRequestClose={() => setIsStreakModalOpen(false)}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="w-[90%] bg-white rounded-2xl p-4">
            <TouchableOpacity 
              onPress={() => setIsStreakModalOpen(false)}
              className="absolute right-4 top-4 z-10"
            >
              <Ionicons name="close" size={24} color="black" />
            </TouchableOpacity>
            <StreakDisplay />
          </View>
          </View>
      </Modal>
      <View className="flex-row items-center justify-end px-4 gap-4">
        <TouchableOpacity onPress={() => setIsStreakModalOpen(true)}>
          <Text className="text-3xl">🔥</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => {}}>
          <Text className="text-white">Sign Out</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}