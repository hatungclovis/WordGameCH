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

interface GameLoseModalProps {
  visible: boolean;
  onPlayAgain: () => void;
  onGoHome: () => void;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function GameLoseModal({ visible, onPlayAgain, onGoHome }: GameLoseModalProps) {
  const { score, currentWord, guesses, statistics, settings } = useGameStore();
  
  // Animation values
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);
  
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
    } else {
      opacity.value = 0;
      scale.value = 0;
    }
  }, [visible]);
  
  const animatedModalStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));
  
  const attemptsUsed = guesses.length;
  
  const getLoseTitle = () => {
    return '😔 Game Over';
  };
  
  const getLoseMessage = () => {
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
      
      const message = `Word Game CH\nFailed\nScore: ${score}\n\n${grid}`;
      
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
        <Animated.View style={[styles.modal, animatedModalStyle, settings.darkMode && styles.darkModal]}>
          {/* Result Header */}
          <View style={styles.header}>
            <Text style={[styles.title, settings.darkMode && styles.darkText]}>
              {getLoseTitle()}
            </Text>
            <Text style={[styles.subtitle, settings.darkMode && styles.darkSubtitle]}>
              {getLoseMessage()}
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
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 30,
    width: Math.min(400, screenWidth - 40),
    maxHeight: screenHeight - 80,
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