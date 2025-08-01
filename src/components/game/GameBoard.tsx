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

interface GameBoardProps {
  availableHeight?: number;
}

export default function GameBoard({ availableHeight }: GameBoardProps) {
  const { 
    guesses, 
    currentGuess, 
    wordLength, 
    maxAttempts,
    gameStatus,
    settings 
  } = useGameStore();
  
  // Animation state
  const shakeX = useSharedValue(0);
  const lastGuessCount = useRef(guesses.length);
  const [lastRevealedRow, setLastRevealedRow] = React.useState(-1);
  
  // Responsive tile size calculation with proper auto-layout
  const calculateResponsiveSizes = () => {
    const horizontalPadding = 40; // Total padding on both sides
    const tileSpacing = 4; // Space between tiles
    const availableWidth = screenWidth - horizontalPadding;
    
    // Calculate base tile size based on available width
    const maxTileSizeByWidth = (availableWidth - (wordLength - 1) * tileSpacing) / wordLength;
    
    // Start with a reasonable tile size based on available height
    let tileSize = maxTileSizeByWidth;
    let rowSpacing = 4;
    
    // If we have available height constraint, calculate optimal size
    if (availableHeight && availableHeight > 0) {
      // Calculate the maximum tile size that fits within available height
      const minRowSpacing = 3;
      const maxTileSizeByHeight = (availableHeight - (minRowSpacing * (maxAttempts - 1))) / maxAttempts;
      
      // Use the smaller of width-constrained or height-constrained size
      tileSize = Math.min(maxTileSizeByWidth, maxTileSizeByHeight);
      
      // Ensure minimum size for readability, but not too small
      tileSize = Math.max(tileSize, 20);
      
      // Calculate proportional row spacing
      rowSpacing = Math.max(tileSize * 0.06, 3);
      
      // Double-check that everything fits
      const totalRequiredHeight = (tileSize * maxAttempts) + (rowSpacing * (maxAttempts - 1));
      if (totalRequiredHeight > availableHeight) {
        // Recalculate with tighter constraints
        tileSize = (availableHeight - (minRowSpacing * (maxAttempts - 1))) / maxAttempts;
        tileSize = Math.max(tileSize, 18); // Absolute minimum
        rowSpacing = minRowSpacing;
      }
    } else {
      // No height constraint, use reasonable defaults based on word length
      const maxSizes = {
        3: 70, 4: 65, 5: 60, 6: 50, 7: 45, 8: 40, 9: 35
      };
      const maxSize = maxSizes[wordLength as keyof typeof maxSizes] || 30;
      tileSize = Math.min(maxTileSizeByWidth, maxSize);
      tileSize = Math.max(tileSize, 20);
      rowSpacing = Math.max(tileSize * 0.08, 4);
    }
    
    return { tileSize, rowSpacing };
  };
  
  const { tileSize, rowSpacing } = calculateResponsiveSizes();
  
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
      <View key={`row-${i}`} style={[styles.row, { marginBottom: rowSpacing }]}>
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
      <Animated.View key="current-row" style={[styles.row, { marginBottom: rowSpacing }, animatedStyle]}>
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
      <View key={`empty-row-${i}`} style={[styles.row, { marginBottom: i === remainingRows - 1 ? 0 : rowSpacing }]}>
        {emptyRow}
      </View>
    );
  }
  
  // Expose shake function for invalid guess feedback
  React.useImperativeHandle(null, () => ({
    triggerShake: triggerShakeAnimation,
  }));
  
  return (
    <View style={styles.container}>
      <View style={[
        styles.gameBoard,
        availableHeight && { maxHeight: availableHeight }
      ]}>
        {rows}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameBoard: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
});