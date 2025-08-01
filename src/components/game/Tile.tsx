import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  interpolateColor,
} from 'react-native-reanimated';
import { LetterState, COLORS } from '../../types';
import { useGameStore } from '../../services/gameStore';

interface TileProps {
  letter?: string;
  state: LetterState;
  size?: number;
  style?: ViewStyle;
  animationDelay?: number;
  shouldAnimate?: boolean;
}

export default function Tile({ 
  letter, 
  state, 
  size = 60, 
  style, 
  animationDelay = 0,
  shouldAnimate = false 
}: TileProps) {
  const { settings } = useGameStore();
  
  // Animation values
  const flipRotation = useSharedValue(0);
  const scale = useSharedValue(1);
  const backgroundColorProgress = useSharedValue(0);
  
  // Calculate responsive margins based on tile size
  const tileMargin = Math.max(size * 0.04, 2); // Margin scales with tile size, minimum 2px
  
  // Animation trigger
  useEffect(() => {
    if (shouldAnimate && letter) {
      // Flip animation sequence
      flipRotation.value = withDelay(
        animationDelay,
        withSequence(
          withTiming(90, { duration: 250 }),
          withTiming(0, { duration: 250 })
        )
      );
      
      // Background color change at the flip point
      backgroundColorProgress.value = withDelay(
        animationDelay + 250, // At the flip point
        withTiming(1, { duration: 0 })
      );
      
      // Subtle scale effect
      scale.value = withDelay(
        animationDelay,
        withSequence(
          withTiming(1.05, { duration: 100 }),
          withTiming(1, { duration: 150 })
        )
      );
    }
  }, [shouldAnimate, letter, animationDelay]);
  
  // Pop-in animation for new letters
  useEffect(() => {
    if (letter && state === 'empty') {
      scale.value = withSequence(
        withTiming(1.1, { duration: 100 }),
        withTiming(1, { duration: 100 })
      );
    }
  }, [letter]);
  
  // Get colors outside of animated styles (static values)
  const emptyColor = settings.darkMode ? '#3a3a3c' : COLORS.empty;
  const revealedColor = (() => {
    switch (state) {
      case 'correct':
        return COLORS.correct;
      case 'present':
        return COLORS.present;
      case 'absent':
        return COLORS.absent;
      default:
        return emptyColor;
    }
  })();
  
  const borderColor = (() => {
    if (letter && state === 'empty') {
      return settings.darkMode ? '#565656' : '#878a8c';
    }
    return settings.darkMode ? COLORS.darkBorder : COLORS.border;
  })();
  
  const emptyTextColor = settings.darkMode ? COLORS.darkText : COLORS.text;
  const revealedTextColor = '#ffffff';

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateX: `${flipRotation.value}deg` },
        { scale: scale.value }
      ],
      backgroundColor: interpolateColor(
        backgroundColorProgress.value,
        [0, 1],
        [emptyColor, revealedColor]
      ),
    };
  });

  const textStyle = useAnimatedStyle(() => {
    return {
      color: interpolateColor(
        backgroundColorProgress.value,
        [0, 1],
        [emptyTextColor, revealedTextColor]
      ),
    };
  });

  return (
    <Animated.View
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          borderColor: borderColor,
          margin: tileMargin, // Responsive margin
        },
        animatedStyle,
        style
      ]}
    >
      <Animated.Text 
        style={[
          styles.letter,
          {
            fontSize: size * 0.5, // Font size scales with tile size
          },
          textStyle
        ]}
      >
        {letter || ''}
      </Animated.Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  letter: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});