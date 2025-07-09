import Ionicons from '@expo/vector-icons/Ionicons';
import React from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';

import { StreakDisplay } from './StreakDisplay';

interface StreakModalProps {
  isVisible: boolean;
  onClose: () => void;
}

export function StreakModal({ isVisible, onClose }: StreakModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-[90%] bg-white rounded-2xl p-4">
          <TouchableOpacity 
            onPress={onClose}
            className="absolute right-4 top-4 z-10"
          >
            <Ionicons name="close" size={24} color="black" />
          </TouchableOpacity>
          
          <StreakDisplay />
        </View>
      </View>
    </Modal>
  );
} 