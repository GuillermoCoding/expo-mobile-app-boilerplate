import Ionicons from '@expo/vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useState, useRef } from 'react';
import { View, ActionSheetIOS, Platform, Pressable, Text, Modal, Dimensions } from 'react-native';

import { useDeleteStoolRecordMutation } from '@/services/hooks/mutations/useDeleteStoolRecordMutation';

interface Props {
  recordId: number;
}

export const StoolRecordDetailsHeaderRight = ({ recordId }: Props) => {
  const [isAndroidMenuVisible, setIsAndroidMenuVisible] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, right: 0 });
  const buttonRef = useRef<View>(null);
  const navigation = useNavigation();
  const deleteStoolRecord = useDeleteStoolRecordMutation();

  const handleDelete = async () => {
    try {
      await deleteStoolRecord.mutateAsync(recordId);
      navigation.goBack();
    } catch (error) {
      console.error('Error deleting stool record:', error);
    }
  };

  const showMenu = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Delete'],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 0,
        },
        (buttonIndex) => {
          if (buttonIndex === 1) {
            handleDelete();
          }
        }
      );
    } else {
      buttonRef.current?.measureInWindow((x, y, width, height) => {
        setMenuPosition({
          top: y + height,
          right: Dimensions.get('window').width - (x + width),
        });
        setIsAndroidMenuVisible(true);
      });
    }
  };

  return (
    <View className="relative">
      <View ref={buttonRef}>
        <Pressable onPress={showMenu} className="p-2">
          <Ionicons name="ellipsis-vertical" size={24} color="white" />
        </Pressable>
      </View>

      {Platform.OS === 'android' && (
        <Modal
          visible={isAndroidMenuVisible}
          transparent
          animationType="fade"
          onRequestClose={() => setIsAndroidMenuVisible(false)}
        >
          <Pressable
            className="flex-1 bg-black/20"
            onPress={() => setIsAndroidMenuVisible(false)}
          >
            <View
              className="bg-white rounded-lg shadow-lg w-48 overflow-hidden"
              style={{
                position: 'absolute',
                top: menuPosition.top,
                right: menuPosition.right,
              }}
            >
              <View className="py-2">
                <Pressable
                  onPress={() => {
                    setIsAndroidMenuVisible(false);
                    handleDelete();
                  }}
                  className="flex-row items-center px-4 py-3 active:bg-gray-100"
                >
                  <Ionicons name="trash" size={20} color="#ef4444" />
                  <Text className="text-red-500 ml-3 text-base">Delete</Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        </Modal>
      )}
    </View>
  );
}; 