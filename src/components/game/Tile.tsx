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
  runOnJS,
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
  const opacity = useSharedValue(1);
  
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
  
  const getBackgroundColor = () => {
    switch (state) {
      case 'correct':
        return COLORS.correct;
      case 'present':
        return COLORS.present;
      case 'absent':
        return COLORS.absent;
      case 'empty':
      default:
        return settings.darkMode ? '#3a3a3c' : COLORS.empty;
    }
  };
  
  const getBorderColor = () => {
    if (letter && state === 'empty') {
      return settings.darkMode ? '#565656' : '#878a8c';
    }
    return settings.darkMode ? COLORS.darkBorder : COLORS.border;
  };
  
  const getTextColor = () => {
    if (state === 'empty') {
      return settings.darkMode ? COLORS.darkText : COLORS.text;
    }
    return '#ffffff';
  };

  // Animated styles
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { rotateX: `${flipRotation.value}deg` },
        { scale: scale.value }
      ],
      opacity: opacity.value,
    };
  });

  // Front side style (shows during first half of flip)
  const frontStyle = useAnimatedStyle(() => {
    const isFlipped = flipRotation.value > 45;
    return {
      opacity: isFlipped ? 0 : 1,
      transform: [{ rotateX: `${flipRotation.value}deg` }],
    };
  });

  // Back side style (shows during second half of flip)
  const backStyle = useAnimatedStyle(() => {
    const isFlipped = flipRotation.value > 45;
    return {
      opacity: isFlipped ? 1 : 0,
      transform: [{ rotateX: `${flipRotation.value - 180}deg` }],
    };
  });

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: size,
          height: size,
        },
        style
      ]}
    >
      {/* Front side - empty/typing state */}
      <Animated.View
        style={[
          styles.tile,
          frontStyle,
          {
            width: size,
            height: size,
            backgroundColor: settings.darkMode ? '#3a3a3c' : COLORS.empty,
            borderColor: getBorderColor(),
            position: 'absolute',
          }
        ]}
      >
        <Text 
          style={[
            styles.letter,
            {
              fontSize: size * 0.5,
              color: getTextColor(),
            }
          ]}
        >
          {letter || ''}
        </Text>
      </Animated.View>

      {/* Back side - revealed state */}
      <Animated.View
        style={[
          styles.tile,
          backStyle,
          {
            width: size,
            height: size,
            backgroundColor: getBackgroundColor(),
            borderColor: getBorderColor(),
            position: 'absolute',
          }
        ]}
      >
        <Text 
          style={[
            styles.letter,
            {
              fontSize: size * 0.5,
              color: getTextColor(),
            }
          ]}
        >
          {letter || ''}
        </Text>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  tile: {
    borderWidth: 2,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  letter: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
});
