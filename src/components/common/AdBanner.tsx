import React from 'react';
import { View, StyleSheet, Platform } from 'react-native';
import { useGameStore } from '../../services/gameStore';

interface AdBannerProps {
  size?: 'banner' | 'largeBanner' | 'mediumRectangle';
  style?: any;
}

export default function AdBanner({ size = 'banner', style }: AdBannerProps) {
  const { settings } = useGameStore();
  
  // For development, show a placeholder
  // In production, this would integrate with Google AdMob or Facebook Audience Network
  const [adLoaded, setAdLoaded] = React.useState(false);
  
  React.useEffect(() => {
    // Simulate ad loading
    const timer = setTimeout(() => setAdLoaded(true), 1000);
    return () => clearTimeout(timer);
  }, []);
  
  // Don't show ads in development or if disabled
  if (__DEV__ || !adLoaded) {
    return null;
  }
  
  const getAdDimensions = () => {
    switch (size) {
      case 'banner':
        return { width: 320, height: 50 };
      case 'largeBanner':
        return { width: 320, height: 100 };
      case 'mediumRectangle':
        return { width: 300, height: 250 };
      default:
        return { width: 320, height: 50 };
    }
  };
  
  const dimensions = getAdDimensions();
  
  return (
    <View style={[
      styles.adContainer,
      {
        width: dimensions.width,
        height: dimensions.height,
        backgroundColor: settings.darkMode ? '#2a2a2c' : '#f5f5f5',
      },
      style
    ]}>
      {/* Placeholder for actual ad component */}
      <View style={[styles.adPlaceholder, settings.darkMode && styles.darkPlaceholder]}>
        {/* This will be replaced with actual ad component in production */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  adContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 8,
  },
  adPlaceholder: {
    flex: 1,
    width: '100%',
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
  },
  darkPlaceholder: {
    backgroundColor: '#3a3a3c',
  },
});

// Export configuration for production ad setup
export const AdConfig = {
  // Google AdMob configuration
  admob: {
    ios: {
      banner: 'ca-app-pub-YOUR_PUBLISHER_ID/YOUR_IOS_BANNER_UNIT_ID',
      interstitial: 'ca-app-pub-YOUR_PUBLISHER_ID/YOUR_IOS_INTERSTITIAL_UNIT_ID',
      rewarded: 'ca-app-pub-YOUR_PUBLISHER_ID/YOUR_IOS_REWARDED_UNIT_ID',
    },
    android: {
      banner: 'ca-app-pub-YOUR_PUBLISHER_ID/YOUR_ANDROID_BANNER_UNIT_ID',
      interstitial: 'ca-app-pub-YOUR_PUBLISHER_ID/YOUR_ANDROID_INTERSTITIAL_UNIT_ID',
      rewarded: 'ca-app-pub-YOUR_PUBLISHER_ID/YOUR_ANDROID_REWARDED_UNIT_ID',
    },
  },
  
  // Test ad unit IDs for development
  test: {
    banner: Platform.select({
      ios: 'ca-app-pub-3940256099942544/2934735716',
      android: 'ca-app-pub-3940256099942544/6300978111',
    }),
    interstitial: Platform.select({
      ios: 'ca-app-pub-3940256099942544/4411468910',
      android: 'ca-app-pub-3940256099942544/1033173712',
    }),
    rewarded: Platform.select({
      ios: 'ca-app-pub-3940256099942544/1712485313',
      android: 'ca-app-pub-3940256099942544/5224354917',
    }),
  },
};
