import React from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Share,
  Platform,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import { useGameStore } from '../../services/gameStore';
import { triggerNotificationFeedback } from '../../utils/haptics';

interface GameResultModalProps {
  visible: boolean;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function GameResultModal({ visible, onPlayAgain, onGoHome }: GameResultModalProps) {
  const { gameStatus, score, currentWord, guesses, statistics, settings } = useGameStore();
  
  // Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  const confettiOpacity = useSharedValue(0);
  
  // Local state to prevent multiple button presses
  const [isProcessing, setIsProcessing] = React.useState(false);
  
  // Trigger animations when modal becomes visible
  React.useEffect(() => {
    if (visible) {
      setIsProcessing(false); // Reset processing state when modal opens
      
      // Modal entrance animation
      opacity.value = withTiming(1, { duration: 200 });
      scale.value = withSequence(
        withDelay(100, withSpring(1.1, { damping: 8 })),
        withSpring(1, { damping: 10 })
      );
      
      // Celebration animation for wins
      if (gameStatus === 'won') {
        confettiOpacity.value = withSequence(
          withDelay(300, withTiming(1, { duration: 500 })),
          withDelay(2000, withTiming(0, { duration: 1000 }))
        );
        
        // Haptic celebration
        if (settings.hapticEnabled) {
          setTimeout(() => triggerNotificationFeedback('Success'), 300);
        }
      }
    } else {
      opacity.value = 0;
      scale.value = 0;
      confettiOpacity.value = 0;
    }
  }, [visible, gameStatus, settings.hapticEnabled]);
  
  const animatedModalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  
  const animatedConfettiStyle = useAnimatedStyle(() => ({
    opacity: confettiOpacity.value,
  }));
  
  const isWon = gameStatus === 'won';
  const attemptsUsed = guesses.length;
  
  const getResultTitle = () => {
    if (isWon) {
      switch (attemptsUsed) {
        case 1: return '🏆 GENIUS!';
        case 2: return '🎯 MAGNIFICENT!';
        case 3: return '🌟 IMPRESSIVE!';
        case 4: return '👏 SPLENDID!';
        case 5: return '✨ GREAT!';
        default: return '🎉 PHEW!';
      }
    }
    return '😔 Game Over';
  };
  
  const getResultMessage = () => {
    if (isWon) {
      return `You guessed the word in ${attemptsUsed} ${attemptsUsed === 1 ? 'try' : 'tries'}!`;
    }
    return `The word was "${currentWord.toUpperCase()}"`;
  };
  
  const handlePlayAgain = React.useCallback(() => {
    if (isProcessing) return; // Prevent multiple clicks
    setIsProcessing(true);
    onPlayAgain();
  }, [isProcessing, onPlayAgain]);
  
  const handleGoHome = React.useCallback(() => {
    if (isProcessing) return; // Prevent multiple clicks
    setIsProcessing(true);
    onGoHome();
  }, [isProcessing, onGoHome]);
  
  const shareResults = async () => {
    if (isProcessing) return; // Prevent multiple clicks during processing
    
    try {
      const grid = guesses.map(guess => 
        guess.states.map(state => {
          switch (state) {
            case 'correct': return '🟩';
            case 'present': return '🟨';
            case 'absent': return '⬜';
            default: return '⬜';
          }
        }).join('')
      ).join('\n');
      
      const message = `Word Game CH\n${isWon ? `Solved in ${attemptsUsed}/${guesses.length + (isWon ? 0 : 1)}` : 'Failed'}\nScore: ${score}\n\n${grid}`;
      
      if (Platform.OS === 'web') {
        navigator.clipboard.writeText(message);
        alert('Results copied to clipboard!');
      } else {
        await Share.share({ message });
      }
    } catch (error) {
      console.log('Share failed:', error);
    }
  };
  
  // Don't render modal content if not visible
  if (!visible) {
    return null;
  }
  
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={() => {}} // Prevent hardware back button from closing
    >
      <View style={styles.overlay}>
        {/* Confetti Effect */}
        {isWon && (
          <Animated.View style={[styles.confetti, animatedConfettiStyle]}>
            <Text style={styles.confettiText}>🎉🎊✨🌟⭐🎉🎊✨🌟⭐</Text>
          </Animated.View>
        )}
        
        <Animated.View style={[styles.modal, animatedModalStyle, settings.darkMode && styles.darkModal]}>
          {/* Result Header */}
          <View style={styles.header}>
            <Text style={[styles.title, settings.darkMode && styles.darkText]}>
              {getResultTitle()}
            </Text>
            <Text style={[styles.subtitle, settings.darkMode && styles.darkSubtitle]}>
              {getResultMessage()}
            </Text>
          </View>
          
          {/* Statistics */}
          <View style={[styles.statsContainer, settings.darkMode && styles.darkStatsContainer]}>
            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, settings.darkMode && styles.darkText]}>{score}</Text>
                <Text style={[styles.statLabel, settings.darkMode && styles.darkSubtitle]}>Score</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, settings.darkMode && styles.darkText]}>{attemptsUsed}</Text>
                <Text style={[styles.statLabel, settings.darkMode && styles.darkSubtitle]}>Tries</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, settings.darkMode && styles.darkText]}>{Math.round(statistics.winPercentage)}%</Text>
                <Text style={[styles.statLabel, settings.darkMode && styles.darkSubtitle]}>Win Rate</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={[styles.statNumber, settings.darkMode && styles.darkText]}>{statistics.currentStreak}</Text>
                <Text style={[styles.statLabel, settings.darkMode && styles.darkSubtitle]}>Streak</Text>
              </View>
            </View>
          </View>
          
          {/* Action Buttons */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity 
              style={[styles.button, styles.shareButton]} 
              onPress={shareResults}
              disabled={isProcessing}
            >
              <Text style={styles.shareButtonText}>📤 Share</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.button, 
                styles.playAgainButton,
                isProcessing && styles.disabledButton
              ]} 
              onPress={handlePlayAgain}
              disabled={isProcessing}
            >
              <Text style={styles.playAgainButtonText}>
                {isProcessing ? '🔄 Starting...' : '🎮 Play Again'}
              </Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={[
                styles.button, 
                styles.homeButton,
                isProcessing && styles.disabledButton
              ]} 
              onPress={handleGoHome}
              disabled={isProcessing}
            >
              <Text style={[styles.homeButtonText, settings.darkMode && styles.darkText]}>
                🏠 Home
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  confetti: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    pointerEvents: 'none',
  },
  confettiText: {
    fontSize: 40,
    textAlign: 'center',
    lineHeight: 60,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    marginHorizontal: 30,
    maxWidth: 400,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 15,
  },
  darkModal: {
    backgroundColor: '#2a2a2c',
  },
  header: {
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1b',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#787c7e',
    textAlign: 'center',
  },
  darkText: {
    color: '#ffffff',
  },
  darkSubtitle: {
    color: '#a0a0a0',
  },
  statsContainer: {
    backgroundColor: '#f6f7f8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 30,
  },
  darkStatsContainer: {
    backgroundColor: '#3a3a3c',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1b',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#787c7e',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  shareButton: {
    backgroundColor: '#6aaa64',
  },
  shareButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  playAgainButton: {
    backgroundColor: '#c9b458',
  },
  playAgainButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  homeButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#d3d6da',
  },
  homeButtonText: {
    color: '#1a1a1b',
    fontSize: 16,
    fontWeight: '600',
  },
});