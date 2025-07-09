import React from 'react';
import { Modal, View, Text, Animated } from 'react-native';

interface AnalyzingModalProps {
  isVisible: boolean;
  progress: number;
}

export function AnalyzingModal({ isVisible, progress }: AnalyzingModalProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="w-[90%] bg-white rounded-2xl p-6">
          <Text className="text-xl font-semibold mb-4">Analyzing food...</Text>
          
          {/* Progress circle */}
          <View className="items-center justify-center mb-4">
            <View className="w-32 h-32 rounded-full items-center justify-center">
              <View className="absolute w-32 h-32 rounded-full border-8 border-gray-200" />
              <Animated.View 
                className="absolute w-32 h-32 rounded-full border-8 border-blue-500"
                style={{
                  transform: [
                    { rotateZ: `${progress * 360}deg` }
                  ],
                  opacity: progress
                }}
              />
              <Text className="text-2xl font-bold">{Math.round(progress * 100)}%</Text>
            </View>
          </View>

          <Text className="text-center text-gray-600">
            We'll notify you when done!
          </Text>
        </View>
      </View>
    </Modal>
  );
} 
