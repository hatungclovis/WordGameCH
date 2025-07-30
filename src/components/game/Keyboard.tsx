import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { triggerHapticFeedback } from '../../utils/haptics';
import { useGameStore } from '../../services/gameStore';
import { GameEngine } from '../../services/GameEngine';
import { LetterState } from '../../types';

const { width: screenWidth } = Dimensions.get('window');

const QWERTY_ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'DELETE']
];

export default function Keyboard() {
  const { 
    settings,
    guesses,
    currentGuess,
    gameStatus,
    wordLength,
    makeGuess,
    updateCurrentGuess
  } = useGameStore();
  
  // Get keyboard state based on guesses
  const keyboardState = React.useMemo(() => {
    return GameEngine.getKeyboardState(guesses);
  }, [guesses]);
  
  const handleKeyPress = async (key: string) => {
    if (gameStatus !== 'playing') return;
    
    // Haptic feedback
    if (settings.hapticEnabled) {
      triggerHapticFeedback('Light');
    }
    
    if (key === 'DELETE') {
      const newGuess = currentGuess.slice(0, -1);
      updateCurrentGuess(newGuess);
    } else if (key === 'ENTER') {
      if (currentGuess.length === wordLength) {
        const result = await makeGuess(currentGuess);
        // makeGuess will handle clearing currentGuess on success
      }
    } else if (currentGuess.length < wordLength) {
      const newGuess = currentGuess + key;
      updateCurrentGuess(newGuess);
    }
  };
  
  const getKeyStyle = (key: string) => {
    const state = keyboardState[key] || 'empty';
    const isSpecialKey = key === 'ENTER' || key === 'DELETE';
    
    return [
      styles.key,
      isSpecialKey && styles.specialKey,
      {
        backgroundColor: getKeyBackgroundColor(state, isSpecialKey),
      }
    ];
  };
  
  const getKeyBackgroundColor = (state: LetterState, isSpecialKey: boolean) => {
    if (isSpecialKey) {
      return settings.darkMode ? '#818384' : '#d3d6da';
    }
    
    switch (state) {
      case 'correct':
        return '#6aaa64';
      case 'present':
        return '#c9b458';
      case 'absent':
        return settings.darkMode ? '#3a3a3c' : '#787c7e';
      default:
        return settings.darkMode ? '#818384' : '#d3d6da';
    }
  };
  
  const getKeyTextColor = (state: LetterState, isSpecialKey: boolean) => {
    if (state === 'empty' || isSpecialKey) {
      return settings.darkMode ? '#ffffff' : '#1a1a1b';
    }
    return '#ffffff';
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.currentInput}>
        <Text style={[styles.inputText, settings.darkMode && styles.darkText]}>
          {currentGuess.padEnd(wordLength, '_')}
        </Text>
      </View>
      
      {QWERTY_ROWS.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.row}>
          {row.map((key) => {
            const state = keyboardState[key] || 'empty';
            const isSpecialKey = key === 'ENTER' || key === 'DELETE';
            
            return (
              <TouchableOpacity
                key={key}
                style={getKeyStyle(key)}
                onPress={() => handleKeyPress(key)}
                activeOpacity={0.7}
              >
                <Text 
                  style={[
                    styles.keyText,
                    isSpecialKey && styles.specialKeyText,
                    { color: getKeyTextColor(state, isSpecialKey) }
                  ]}
                >
                  {key === 'DELETE' ? '\u2326' : key}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingBottom: 20,
  },
  currentInput: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 15,
  },
  inputText: {
    fontSize: 24,
    fontWeight: 'bold',
    letterSpacing: 8,
    color: '#1a1a1b',
  },
  darkText: {
    color: '#ffffff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  key: {
    backgroundColor: '#d3d6da',
    borderRadius: 4,
    marginHorizontal: 3,
    minWidth: (screenWidth - 80) / 10,
    height: 58,
    justifyContent: 'center',
    alignItems: 'center',
  },
  specialKey: {
    minWidth: (screenWidth - 80) / 6.5,
  },
  keyText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1b',
  },
  specialKeyText: {
    fontSize: 12,
  },
});
