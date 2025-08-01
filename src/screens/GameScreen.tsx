import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
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

export default function GameScreen({ navigation, route }: Props) {
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

  React.useEffect(() => {
    // Initialize the game when screen loads
    startNewGame(routeDifficulty, wordLength);
  }, [routeDifficulty, wordLength, startNewGame]);

  // Show result modal when game ends
  React.useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      // Delay to allow final animation to complete
      setTimeout(() => setShowResultModal(true), 1500);
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

  const handlePlayAgain = () => {
    setShowResultModal(false);
    resetGame();
    startNewGame(routeDifficulty, wordLength);
  };

  const handleGoHome = () => {
    setShowResultModal(false);
    resetGame();
    navigation.navigate('Home');
  };

  const handleRetry = () => {
    resetGame();
    startNewGame(routeDifficulty, wordLength);
  };

  if (isLoading) {
    return (
      <SafeAreaView style={[styles.container, settings.darkMode && styles.darkContainer]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#6aaa64" />
          <Text style={[styles.loadingText, settings.darkMode && styles.darkText]}>
            Loading game...
          </Text>
        </View>
      </SafeAreaView>
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
    <SafeAreaView style={[styles.container, settings.darkMode && styles.darkContainer]}>
      {/* Header */}
      <View style={[styles.header, settings.darkMode && styles.darkHeader]}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={[styles.backButtonText, settings.darkMode && styles.darkText]}>← Back</Text>
        </TouchableOpacity>
        
        <View style={styles.headerCenter}>
          <Text style={[styles.difficultyText, settings.darkMode && styles.darkText]}>
            {routeDifficulty.toUpperCase()} • {wordLength} letters
          </Text>
          <Text style={[styles.scoreText, settings.darkMode && styles.darkSubtitle]}>
            Score: {score} • Attempts: {attemptsLeft}
          </Text>
        </View>
        
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={() => navigation.navigate('Stats')}>
            <Text style={[styles.statsButton, settings.darkMode && styles.darkText]}>📊</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Game Area */}
      <View style={styles.gameArea}>
        <GameBoard />
      </View>

      {/* Controls */}
      {gameStatus === 'playing' && (
        <View style={styles.keyboardArea}>
          <Keyboard />
          
          <View style={styles.bottomControls}>
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
      <GameResultModal
        visible={showResultModal}
        onPlayAgain={handlePlayAgain}
        onGoHome={handleGoHome}
      />
      
      {/* Toast Notifications - Now handles hints too! */}
      <Toast />
    </SafeAreaView>
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  darkHeader: {
    borderBottomColor: '#3a3a3c',
  },
  backButton: {
    flex: 1,
  },
  backButtonText: {
    fontSize: 16,
    color: '#6aaa64',
    fontWeight: '600',
  },
  headerCenter: {
    flex: 2,
    alignItems: 'center',
  },
  headerRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  difficultyText: {
    fontSize: 16,
    fontWeight: '600',
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
  statsButton: {
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
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  keyboardArea: {
    paddingTop: 10,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
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
  darkText: {
    color: '#ffffff',
  },
});