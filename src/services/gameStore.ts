import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { 
  GameState, 
  GameSettings, 
  GameStatistics, 
  DifficultyLevel, 
  GameStatus,
  DIFFICULTY_CONFIG,
  Guess,
  HintData 
} from '../types';
import { wordService } from './WordService';
import { GameEngine } from './GameEngine';

interface GameStore extends GameState {
  // Game actions
  startNewGame: (difficulty: DifficultyLevel, wordLength: number) => Promise<void>;
  makeGuess: (guess: string) => Promise<{ valid: boolean; message?: string }>;
  updateCurrentGuess: (guess: string) => void;
  useHint: () => HintData | null;
  resetGame: () => void;
  
  // Game state
  isLoading: boolean;
  errorMessage: string | null;
  toastMessage: string | null;
  showToast: boolean;
  
  // Settings
  settings: GameSettings;
  updateSettings: (settings: Partial<GameSettings>) => void;
  
  // Statistics
  statistics: GameStatistics;
  updateStatistics: (gameWon: boolean, attempts: number, score: number) => void;
  resetStatistics: () => void;
  
  // Toast functions
  showToastMessage: (message: string) => void;
  hideToast: () => void;
}

const initialGameState: GameState = {
  currentWord: '',
  guesses: [],
  currentGuess: '',
  gameStatus: 'playing',
  difficulty: 'medium',
  wordLength: 5,
  hintsUsed: 0,
  score: 0,
  attemptsLeft: 5,
  maxAttempts: 5,
  startTime: new Date(),
};

const initialSettings: GameSettings = {
  difficulty: 'medium',
  wordLength: 5,
  hapticEnabled: true,
  darkMode: false,
  soundEnabled: true,
};

const initialStatistics: GameStatistics = {
  gamesPlayed: 0,
  gamesWon: 0,
  currentStreak: 0,
  maxStreak: 0,
  totalScore: 0,
  averageScore: 0,
  winPercentage: 0,
  averageGuesses: 0,
  guessDistribution: {},
};

export const useGameStore = create<GameStore>()(
  persist(
    (set, get) => ({
      ...initialGameState,
      isLoading: false,
      errorMessage: null,
      toastMessage: null,
      showToast: false,
      settings: initialSettings,
      statistics: initialStatistics,

      startNewGame: async (difficulty: DifficultyLevel, wordLength: number) => {
        set({ isLoading: true, errorMessage: null });
        
        try {
          // Initialize word service if not already done
          await wordService.initialize();
          
          // Check if word length is available
          if (!wordService.isWordLengthAvailable(wordLength)) {
            throw new Error(`No words available with length ${wordLength}`);
          }
          
          // Get a random word
          const targetWord = wordService.getRandomWordByLength(wordLength);
          const maxAttempts = DIFFICULTY_CONFIG[difficulty].attempts;
          
          set({
            currentWord: targetWord,
            guesses: [],
            currentGuess: '',
            gameStatus: 'playing',
            difficulty,
            wordLength,
            hintsUsed: 0,
            score: 0,
            attemptsLeft: maxAttempts,
            maxAttempts,
            startTime: new Date(),
            endTime: undefined,
            isLoading: false,
            errorMessage: null,
            toastMessage: null,
            showToast: false,
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            errorMessage: error instanceof Error ? error.message : 'Failed to start game'
          });
        }
      },

      makeGuess: async (guess: string) => {
        const state = get();
        if (state.gameStatus !== 'playing') {
          return { valid: false, message: 'Game is not in progress' };
        }

        // Validate guess format
        if (!GameEngine.isValidGuessFormat(guess, state.wordLength)) {
          const message = `Word must be ${state.wordLength} letters long`;
          get().showToastMessage(message);
          return { valid: false, message };
        }

        // Validate word exists in dictionary
        if (!wordService.isValidWord(guess)) {
          const message = 'Not a valid English word';
          get().showToastMessage(message);
          // Clear the current guess so user can type a new word
          set({ currentGuess: '' });
          return { valid: false, message };
        }

        // Process the valid guess
        const newGuess = GameEngine.createGuess(guess, state.currentWord);
        const newGuesses = [...state.guesses, newGuess];
        const newAttemptsLeft = state.attemptsLeft - 1;
        
        // Check win condition
        const isWon = GameEngine.isGameWon(newGuess);
        const isLost = !isWon && GameEngine.isGameLost(newAttemptsLeft);
        
        let newGameStatus: typeof state.gameStatus = 'playing';
        let endTime: Date | undefined;
        
        if (isWon) {
          newGameStatus = 'won';
          endTime = new Date();
          // Show success toast
          setTimeout(() => {
            get().showToastMessage(`🎉 Correct! The word was "${state.currentWord.toUpperCase()}"`);
          }, 500); // Delay to allow tile animations
        } else if (isLost) {
          newGameStatus = 'lost';
          endTime = new Date();
          // Show failure toast
          setTimeout(() => {
            get().showToastMessage(`😔 The word was "${state.currentWord.toUpperCase()}"`);
          }, 500);
        }
        
        // Calculate score
        const newScore = GameEngine.calculateGameScore(newGuesses, newAttemptsLeft, state.hintsUsed);
        
        set({
          guesses: newGuesses,
          currentGuess: '',
          attemptsLeft: newAttemptsLeft,
          gameStatus: newGameStatus,
          score: newScore,
          endTime,
        });
        
        // Update statistics if game ended
        if (isWon || isLost) {
          get().updateStatistics(isWon, newGuesses.length, newScore);
        }
        
        return { valid: true };
      },

      updateCurrentGuess: (guess: string) => {
        const state = get();
        if (state.gameStatus !== 'playing') return;
        
        set({ currentGuess: guess });
        
        // Auto-submit when word is complete (regardless of validity)
        if (guess.length === state.wordLength) {
          setTimeout(() => {
            get().makeGuess(guess);
          }, 100);
        }
      },

      useHint: () => {
        const state = get();
        if (state.gameStatus !== 'playing') return null;
        
        const hint = GameEngine.getHint(state.currentWord, state.guesses);
        
        if (hint) {
          set({
            hintsUsed: state.hintsUsed + 1,
          });
        }
        
        return hint;
      },

      resetGame: () => {
        set({
          ...initialGameState,
          toastMessage: null,
          showToast: false,
          settings: get().settings,
          statistics: get().statistics,
        });
      },

      updateSettings: (newSettings: Partial<GameSettings>) => {
        set({
          settings: { ...get().settings, ...newSettings },
        });
      },

      showToastMessage: (message: string) => {
        set({ toastMessage: message, showToast: true });
        // Auto-hide toast after 3 seconds
        setTimeout(() => {
          get().hideToast();
        }, 3000);
      },

      hideToast: () => {
        set({ toastMessage: null, showToast: false });
      },

      updateStatistics: (gameWon: boolean, attempts: number, score: number) => {
        const stats = get().statistics;
        const newGamesPlayed = stats.gamesPlayed + 1;
        const newGamesWon = gameWon ? stats.gamesWon + 1 : stats.gamesWon;
        const newTotalScore = stats.totalScore + score;
        
        const newCurrentStreak = gameWon ? stats.currentStreak + 1 : 0;
        const newMaxStreak = Math.max(stats.maxStreak, newCurrentStreak);
        
        const newDistribution = { ...stats.guessDistribution };
        if (gameWon) {
          newDistribution[attempts] = (newDistribution[attempts] || 0) + 1;
        }

        set({
          statistics: {
            gamesPlayed: newGamesPlayed,
            gamesWon: newGamesWon,
            currentStreak: newCurrentStreak,
            maxStreak: newMaxStreak,
            totalScore: newTotalScore,
            averageScore: newTotalScore / newGamesPlayed,
            winPercentage: (newGamesWon / newGamesPlayed) * 100,
            averageGuesses: gameWon ? attempts : stats.averageGuesses,
            guessDistribution: newDistribution,
          },
        });
      },

      resetStatistics: () => {
        set({ statistics: initialStatistics });
      },
    }),
    {
      name: 'wordgamech-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        settings: state.settings,
        statistics: state.statistics,
      }),
    }
  )
);
