import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useGameStore } from '../services/gameStore';
import GameBoard from '../components/game/GameBoard';
import Keyboard from '../components/game/Keyboard';

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
    makeGuess,
    useHint,
    gameStatus,
    currentWord,
    score,
    attemptsLeft,
    hintsUsed,
    isLoading,
    errorMessage,
    currentGuess
  } = useGameStore();
  const { difficulty, wordLength } = route.params;
  const [inputGuess, setInputGuess] = React.useState('');

  React.useEffect(() => {
    // Initialize the game when screen loads
    startNewGame(difficulty, wordLength);
  }, [difficulty, wordLength, startNewGame]);

  const handleSubmitGuess = async () => {
    if (inputGuess.length !== wordLength) {
      Alert.alert('Invalid guess', `Word must be ${wordLength} letters long`);
      return;
    }

    const result = await makeGuess(inputGuess);
    if (!result.valid && result.message) {
      Alert.alert('Invalid guess', result.message);
    } else {
      setInputGuess('');
    }
  };

  const handleUseHint = () => {
    const hint = useHint();
    if (hint) {
      Alert.alert('Hint', `The letter "${hint.letter}" is in the word!`);
    } else {
      Alert.alert('No hints available', 'All letters have been revealed or tried.');
    }
  };

  const handleGameEnd = () => {
    const message = gameStatus === 'won' 
      ? `Congratulations! You found the word "${currentWord}"!\nScore: ${score}`
      : `Game over! The word was "${currentWord}".\nScore: ${score}`;
    
    Alert.alert(
      gameStatus === 'won' ? 'You Won!' : 'Game Over',
      message,
      [
        { text: 'View Stats', onPress: () => navigation.navigate('Stats') },
        { text: 'Play Again', onPress: () => navigation.navigate('Home') },
      ]
    );
  };

  React.useEffect(() => {
    if (gameStatus === 'won' || gameStatus === 'lost') {
      setTimeout(handleGameEnd, 1000); // Delay to show final guess
    }
  }, [gameStatus]);

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
      <SafeAreaView style={[styles.container, settings.darkMode && styles.darkContainer]}>
        <View style={styles.errorContainer}>
          <Text style={[styles.errorText, settings.darkMode && styles.darkText]}>
            {errorMessage}
          </Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.retryButtonText}>Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.container, settings.darkMode && styles.darkContainer]}>
      <View style={styles.header}>
        <Text style={[styles.difficultyText, settings.darkMode && styles.darkText]}>
          {difficulty.toUpperCase()} • {wordLength} letters
        </Text>
        <Text style={[styles.scoreText, settings.darkMode && styles.darkText]}>
          Score: {score} • Attempts: {attemptsLeft}
        </Text>
      </View>

      <View style={styles.gameArea}>
        <GameBoard />
      </View>

      {gameStatus === 'playing' && (
        <View style={styles.keyboardArea}>
          <Keyboard />
          
          <View style={styles.bottomControls}>
            <TouchableOpacity 
              style={styles.hintButton}
              onPress={handleUseHint}
            >
              <Text style={styles.buttonText}>💡 Hint ({hintsUsed} used)</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
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
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  difficultyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1b',
    marginBottom: 5,
  },
  scoreText: {
    fontSize: 14,
    color: '#787c7e',
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 18,
    color: '#dc3545',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6aaa64',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
  },
  keyboardArea: {
    paddingTop: 10,
  },
  bottomControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  hintButton: {
    backgroundColor: '#c9b458',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  darkText: {
    color: '#ffffff',
  },
});
