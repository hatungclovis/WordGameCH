import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useGameStore } from '../services/gameStore';
import GameBoard from '../components/game/GameBoard';
import Keyboard from '../components/game/Keyboard';
import GameResultModal from '../components/game/GameResultModal';
import Toast from '../components/game/Toast';
import ErrorScreen from '../components/ErrorScreen';

type GameScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Game'>;
type GameScreenRouteProp = RouteProp<RootStackParamList, 'Game'>;

interface Props {
  navigation: GameScreenNavigationProp;
  route: GameScreenRouteProp;
}

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

export default function GameScreen({ navigation, route }: Props) {
  const insets = useSafeAreaInsets();
  const { 
    settings, 
    startNewGame, 
    useHint,
    resetGame,
    gameStatus,
    score,
    attemptsLeft,
    hintsUsed,
    isLoading,
    errorMessage,
    difficulty,
    wordLength: currentWordLength,
    showToastMessage
  } = useGameStore();
  
  const { difficulty: routeDifficulty, wordLength } = route.params;
  const [showResultModal, setShowResultModal] = React.useState(false);
  const [isRestarting, setIsRestarting] = React.useState(false);

  React.useEffect(() => {
    // Initialize the game when screen loads
    startNewGame(routeDifficulty, wordLength);
  }, [routeDifficulty, wordLength, startNewGame]);

  // Show result modal when game ends
  React.useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      // Delay to allow final animation to complete
      const timer = setTimeout(() => setShowResultModal(true), 1500);
      return () => clearTimeout(timer);
    }
  }, [gameStatus]);

  const handleUseHint = () => {
    const hint = useHint();
    if (hint) {
      // Show hint as a centered toast message
      const hintMessage = hint.position !== undefined 
        ? `💡 Hint: Letter "${hint.letter.toUpperCase()}" is at position ${hint.position + 1}`
        : `💡 Hint: Letter "${hint.letter.toUpperCase()}" is in the word`;
      
      showToastMessage(hintMessage);
    } else {
      showToastMessage('💡 No more hints available');
    }
  };

  const handlePlayAgain = React.useCallback(async () => {
    try {
      // Prevent multiple clicks
      if (isRestarting) return;
      setIsRestarting(true);
      
      // Step 1: Close modal first
      setShowResultModal(false);
      
      // Step 2: Wait for modal to close completely
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Step 3: Reset game state
      resetGame();
      
      // Step 4: Wait a bit more for state to settle
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Step 5: Start new game
      await startNewGame(routeDifficulty, wordLength);
      
    } catch (error) {
      console.error('Error restarting game:', error);
    } finally {
      setIsRestarting(false);
    }
  }, [isRestarting, routeDifficulty, wordLength, resetGame, startNewGame]);

  const handleGoHome = React.useCallback(async () => {
    try {
      // Close modal first
      setShowResultModal(false);
      
      // Wait for modal to close
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Reset game state
      resetGame();
      
      // Navigate to home
      navigation.navigate('Home');
    } catch (error) {
      console.error('Error going home:', error);
    }
  }, [resetGame, navigation]);

  const handleRetry = () => {
    resetGame();
    startNewGame(routeDifficulty, wordLength);
  };

  // Calculate responsive dimensions
  const headerHeight = Math.max(60, insets.top + 40);
  const keyboardHeight = 280; // Increased keyboard height to show all 3 rows
  const gameAreaMargin = 20; // Reduced margin slightly
  const hintButtonHeight = 70; // Height for hint button area
  const availableGameHeight = screenHeight - headerHeight - keyboardHeight - hintButtonHeight - (gameAreaMargin * 2) - Math.max(insets.bottom, 20);

  if (isLoading || isRestarting) {
    return (
      <View style={[styles.container, settings.darkMode && styles.darkContainer]}>
        <View style={[styles.loadingContainer, { paddingTop: insets.top + 20 }]}>
          <ActivityIndicator size="large" color="#6aaa64" />
          <Text style={[styles.loadingText, settings.darkMode && styles.darkText]}>
            {isRestarting ? 'Starting new game...' : 'Loading game...'}
          </Text>
        </View>
      </View>
    );
  }

  if (errorMessage) {
    return (
      <ErrorScreen 
        error={errorMessage}
        onRetry={handleRetry}
        showRetry={!errorMessage.includes('missing or corrupted')}
      />
    );
  }

  return (
    <View style={[styles.container, settings.darkMode && styles.darkContainer]}>
      {/* Custom Header with Safe Area */}
      <View style={[
        styles.header, 
        settings.darkMode && styles.darkHeader,
        { 
          paddingTop: insets.top + 10,
          minHeight: headerHeight,
        }
      ]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.backButtonText, settings.darkMode && styles.darkText]}>← Back</Text>
          </TouchableOpacity>
          
          <View style={styles.gameInfo}>
            <Text style={[styles.difficultyText, settings.darkMode && styles.darkText]}>
              {routeDifficulty.toUpperCase()} • {wordLength} letters
            </Text>
            <Text style={[styles.scoreText, settings.darkMode && styles.darkSubtitle]}>
              Score: {score} • Attempts: {attemptsLeft}
            </Text>
          </View>
          
          <TouchableOpacity 
            style={styles.statsButton}
            onPress={() => navigation.navigate('Stats')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.statsButtonText}>📊</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Game Area with Safe Margins */}
      <View style={[
        styles.gameArea, 
        { 
          marginTop: gameAreaMargin,
          height: availableGameHeight,
        }
      ]}>
        <GameBoard availableHeight={availableGameHeight} />
      </View>

      {/* Controls with Safe Area */}
      {gameStatus === 'playing' && (
        <View style={styles.keyboardContainer}>
          <View style={styles.keyboardArea}>
            <Keyboard />
          </View>
          
          <View style={[
            styles.bottomControls,
            { paddingBottom: Math.max(insets.bottom, 20) }
          ]}>
            <TouchableOpacity 
              style={[styles.hintButton, settings.darkMode && styles.darkHintButton]}
              onPress={handleUseHint}
            >
              <Text style={styles.hintButtonText}>💡 Hint ({hintsUsed} used)</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Result Modal */}
      {showResultModal && (
        <GameResultModal
          visible={showResultModal}
          onPlayAgain={handlePlayAgain}
          onGoHome={handleGoHome}
        />
      )}
      
      {/* Toast Notifications */}
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  darkContainer: {
    backgroundColor: '#1a1a1b',
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#ffffff',
    justifyContent: 'flex-end',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'baseline', // Changed from 'center' to 'baseline' for text alignment
    height: 44,
  },
  darkHeader: {
    borderBottomColor: '#3a3a3c',
    backgroundColor: '#1a1a1b',
  },
  backButton: {
    paddingRight: 15,
  },
  backButtonText: {
    fontSize: 20,
    color: '#1a1a1b',
    fontWeight: 'bold',
  },
  gameInfo: {
    flex: 1,
    alignItems: 'center',
  },
  difficultyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1b',
    marginBottom: 2,
  },
  scoreText: {
    fontSize: 12,
    color: '#787c7e',
  },
  darkSubtitle: {
    color: '#a0a0a0',
  },
  darkText: {
    color: '#ffffff',
  },
  statsButton: {
    paddingVertical: 8,
    paddingLeft: 15,
  },
  statsButtonText: {
    fontSize: 18,
    color: '#6aaa64',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#787c7e',
    marginTop: 10,
  },
  gameArea: {
    width: '100%',
    paddingHorizontal: 20,
  },
  keyboardContainer: {
    marginTop: gameAreaMargin,
  },
  keyboardArea: {
    paddingHorizontal: 10,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 5,
  },
  hintButton: {
    backgroundColor: '#c9b458',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  darkHintButton: {
    backgroundColor: '#8a7c3a',
  },
  hintButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
});