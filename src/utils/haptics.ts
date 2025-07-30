import { Platform } from 'react-native';

// Temporary haptics utility that's completely safe
export const triggerHapticFeedback = (style: 'Light' | 'Medium' | 'Heavy' = 'Light') => {
  // Temporarily disabled to avoid expo-haptics issues
  console.log(`Haptic feedback: ${style} (disabled for web compatibility)`);
};

export const triggerNotificationFeedback = (type: 'Success' | 'Warning' | 'Error' = 'Success') => {
  // Temporarily disabled to avoid expo-haptics issues
  console.log(`Notification feedback: ${type} (disabled for web compatibility)`);
};

export const triggerSelectionFeedback = () => {
  // Temporarily disabled to avoid expo-haptics issues
  console.log('Selection feedback (disabled for web compatibility)');
};
