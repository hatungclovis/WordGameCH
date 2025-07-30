import React, { useEffect, useRef } from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  runOnJS,
} from 'react-native-reanimated';
import Tile from './Tile';
import { useGameStore } from '../../services/gameStore';
import { LetterState } from '../../types';
import { triggerNotificationFeedback } from '../../utils/haptics';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function GameBoard() {
  const { 
    guesses, 
    currentGuess, 
    wordLength, 
    maxAttempts,
    gameStatus,
    settings 
  } = useGameStore();
  
  const insets = useSafeAreaInsets();
  
  // Animation state
  const shakeX = useSharedValue(0);
  const lastGuessCount = useRef(guesses.length);
  const [lastRevealedRow, setLastRevealedRow] = React.useState(-1);
  
  // Calculate tile size based on screen width and word length
  const padding = 40;
  const spacing = 4; // 2px margin on each side
  const availableWidth = screenWidth - padding;
  const tileSize = Math.min(
    (availableWidth - (wordLength - 1) * spacing) / wordLength,
    60
  );
  
  // Trigger animations when new guess is made
  useEffect(() => {
    if (guesses.length > lastGuessCount.current) {
      const newGuessIndex = guesses.length - 1;
      const newGuess = guesses[newGuessIndex];
      
      // Trigger tile flip animations
      setLastRevealedRow(newGuessIndex);
      
      // Haptic feedback based on result
      if (settings.hapticEnabled) {
        const hasCorrect = newGuess.states.some(state => state === 'correct');
        const isWon = newGuess.states.every(state => state === 'correct');
        
        if (isWon) {
          triggerNotificationFeedback('Success');
        } else if (hasCorrect) {
          triggerNotificationFeedback('Warning');
        }
      }
      
      lastGuessCount.current = guesses.length;
    }
  }, [guesses.length, settings.hapticEnabled]);
  
  // Shake animation for invalid words
  const triggerShakeAnimation = () => {
    shakeX.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
    
    if (settings.hapticEnabled) {
      triggerNotificationFeedback('Error');
    }
  };
  
  // Animated style for shake effect
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shakeX.value }],
    };
  });
  
  // Create rows for the game board
  const rows = [];
  
  // Add completed guesses
  for (let i = 0; i < guesses.length; i++) {
    const guess = guesses[i];
    const row = [];
    const shouldAnimateThisRow = i === lastRevealedRow;
    
    for (let j = 0; j < wordLength; j++) {
      row.push(
        <Tile
          key={`${i}-${j}`}
          letter={guess.word[j]}
          state={guess.states[j]}
          size={tileSize}
          shouldAnimate={shouldAnimateThisRow}
          animationDelay={j * 100} // Stagger the animations
        />
      );
    }
    
    rows.push(
      <View key={`row-${i}`} style={styles.row}>
        {row}
      </View>
    );
  }
  
  // Add current guess row (if game is still playing)
  if (gameStatus === 'playing' && guesses.length < maxAttempts) {
    const currentRow = [];
    
    for (let j = 0; j < wordLength; j++) {
      const letter = currentGuess[j] || '';
      currentRow.push(
        <Tile
          key={`current-${j}`}
          letter={letter}
          state="empty"
          size={tileSize}
        />
      );
    }
    
    rows.push(
      <Animated.View key="current-row" style={[styles.row, animatedStyle]}>
        {currentRow}
      </Animated.View>
    );
  }
  
  // Add empty rows to fill the board
  const remainingRows = maxAttempts - rows.length;
  for (let i = 0; i < remainingRows; i++) {
    const emptyRow = [];
    
    for (let j = 0; j < wordLength; j++) {
      emptyRow.push(
        <Tile
          key={`empty-${i}-${j}`}
          state="empty"
          size={tileSize}
        />
      );
    }
    
    rows.push(
      <View key={`empty-row-${i}`} style={styles.row}>
        {emptyRow}
      </View>
    );
  }
  
  // Expose shake function for invalid guess feedback
  React.useImperativeHandle(null, () => ({
    triggerShake: triggerShakeAnimation,
  }));
  
  return (
    <View style={styles.outerContainer}>
      <View style={styles.container}>
        {rows}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
