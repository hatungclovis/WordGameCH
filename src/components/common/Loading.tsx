import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withDelay,
} from 'react-native-reanimated';

interface LoadingProps {
  darkMode?: boolean;
  message?: string;
}

export default function Loading({ darkMode = false, message = 'Loading...' }: LoadingProps) {
  // Animation values
  const pulseScale = useSharedValue(1);
  const fadeOpacity = useSharedValue(0);
  
  React.useEffect(() => {
    // Pulse animation for logo
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      false
    );
    
    // Fade in animation
    fadeOpacity.value = withTiming(1, { duration: 500 });
  }, []);
  
  const animatedLogoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));
  
  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: fadeOpacity.value,
  }));
  
  return (
    <Animated.View style={[styles.container, darkMode && styles.darkContainer, animatedContainerStyle]}>
      <Animated.View style={[styles.logoContainer, animatedLogoStyle]}>
        <Text style={styles.logo}>📝</Text>
      </Animated.View>
      
      <Text style={[styles.title, darkMode && styles.darkText]}>
        Word Game CH
      </Text>
      
      <ActivityIndicator 
        size="large" 
        color="#6aaa64" 
        style={styles.spinner}
      />
      
      <Text style={[styles.message, darkMode && styles.darkSubtitle]}>
        {message}
      </Text>
      
      <View style={styles.dotsContainer}>
        {[0, 1, 2].map((index) => (
          <Animated.View
            key={index}
            style={[
              styles.dot,
              darkMode && styles.darkDot,
              {
                opacity: fadeOpacity.value,
              }
            ]}
          />
        ))}
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
  },
  darkContainer: {
    backgroundColor: '#1a1a1b',
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    fontSize: 60,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1b',
    marginBottom: 30,
    textAlign: 'center',
  },
  darkText: {
    color: '#ffffff',
  },
  spinner: {
    marginBottom: 20,
  },
  message: {
    fontSize: 16,
    color: '#787c7e',
    textAlign: 'center',
    marginBottom: 30,
  },
  darkSubtitle: {
    color: '#a0a0a0',
  },
  dotsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6aaa64',
  },
  darkDot: {
    backgroundColor: '#8bc34a',
  },
});
