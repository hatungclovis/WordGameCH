import { Platform } from 'react-native';

// Improved haptics utility that handles different platforms safely
let Haptics: any = null;

// Try to import Expo Haptics only if available
try {
  if (Platform.OS !== 'web') {
    Haptics = require('expo-haptics');
  }
} catch (error) {
  console.log('Expo Haptics not available:', error);
}

export const triggerHapticFeedback = (style: 'Light' | 'Medium' | 'Heavy' = 'Light') => {
  if (!Haptics || Platform.OS === 'web') {
    return; // Silently skip on web or if haptics not available
  }
  
  try {
    switch (style) {
      case 'Light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'Medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'Heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
    }
  } catch (error) {
    console.log('Haptic feedback failed:', error);
  }
};

export const triggerNotificationFeedback = (type: 'Success' | 'Warning' | 'Error' = 'Success') => {
  if (!Haptics || Platform.OS === 'web') {
    return; // Silently skip on web or if haptics not available
  }
  
  try {
    switch (type) {
      case 'Success':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        break;
      case 'Warning':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        break;
      case 'Error':
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        break;
    }
  } catch (error) {
    console.log('Notification feedback failed:', error);
  }
};

export const triggerSelectionFeedback = () => {
  if (!Haptics || Platform.OS === 'web') {
    return; // Silently skip on web or if haptics not available
  }
  
  try {
    Haptics.selectionAsync();
  } catch (error) {
    console.log('Selection feedback failed:', error);
  }
};
