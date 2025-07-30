import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { useGameStore } from '../../services/gameStore';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function Toast() {
  const { showToast, toastMessage, hideToast, settings } = useGameStore();
  const insets = useSafeAreaInsets();
  
  // Animation values - using opacity and scale for better centering
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  
  const hideAnimation = useCallback(() => {
    opacity.value = withTiming(0, { duration: 250 });
    scale.value = withTiming(0.8, { 
      duration: 250,
      easing: Easing.in(Easing.cubic)
    }, () => {
      runOnJS(hideToast)();
    });
  }, [hideToast, opacity, scale]);
  
  useEffect(() => {
    if (showToast) {
      // Show animation - fade in and scale up
      opacity.value = withTiming(1, { duration: 300 });
      scale.value = withTiming(1, { 
        duration: 300, 
        easing: Easing.out(Easing.back(1.2))
      });
      
      // Auto-hide after animation completes
      const timeoutId = setTimeout(() => {
        hideAnimation();
      }, 2500); // Show for 2.5 seconds, then hide
      
      return () => clearTimeout(timeoutId);
    } else {
      // Reset for next toast
      opacity.value = 0;
      scale.value = 0.8;
    }
  }, [showToast, hideAnimation, opacity, scale]);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });
  
  if (!showToast || !toastMessage) {
    return null;
  }
  
  // Calculate the true center position considering safe areas
  const centerY = (screenHeight - insets.top - insets.bottom) / 2 + insets.top;
  
  return (
    <View style={[
      styles.container,
      {
        top: centerY,
        paddingHorizontal: insets.left + 20,
        paddingRight: insets.right + 20,
      }
    ]}>
      <Animated.View 
        style={[
          styles.toastContainer,
          animatedStyle
        ]}
      >
        <View style={[styles.toast, settings.darkMode && styles.darkToast]}>
          <Text style={[styles.toastText, settings.darkMode && styles.darkText]}>
            {toastMessage}
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
    // Use transform to center the toast perfectly
    transform: [{ translateY: -25 }], // Half of typical toast height
  },
  toastContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  toast: {
    backgroundColor: '#333333',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 25,
    maxWidth: screenWidth * 0.85,
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    // Ensure the toast itself is centered within its container
    alignItems: 'center',
    justifyContent: 'center',
  },
  darkToast: {
    backgroundColor: '#555555',
  },
  toastText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
    lineHeight: 20,
  },
  darkText: {
    color: '#ffffff',
  },
});
