export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export type GameStatus = 'playing' | 'won' | 'lost' | 'paused';

export type LetterState = 'correct' | 'present' | 'absent' | 'empty';

export interface Guess {
  word: string;
  states: LetterState[];
}

export interface GameState {
  currentWord: string;
  guesses: Guess[];
  currentGuess: string;
  gameStatus: GameStatus;
  difficulty: DifficultyLevel;
  wordLength: number;
  hintsUsed: number;
  score: number;
  attemptsLeft: number;
  maxAttempts: number;
  startTime: Date;
  endTime?: Date;
}

export interface GameSettings {
  difficulty: DifficultyLevel;
  wordLength: number;
  hapticEnabled: boolean;
  darkMode: boolean;
  soundEnabled: boolean;
}

export interface GameStatistics {
  gamesPlayed: number;
  gamesWon: number;
  currentStreak: number;
  maxStreak: number;
  totalScore: number;
  averageScore: number;
  winPercentage: number;
  averageGuesses: number;
  guessDistribution: Record<number, number>;
}

export interface KeyboardKey {
  letter: string;
  state: LetterState;
  width?: 'normal' | 'wide';
}

export interface HintData {
  letter: string;
  position?: number;
  revealed: boolean;
}

export const DIFFICULTY_CONFIG = {
  easy: { attempts: 7, label: 'Easy' },
  medium: { attempts: 5, label: 'Medium' },
  hard: { attempts: 3, label: 'Hard' },
} as const;

export const WORD_LENGTH_OPTIONS = [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14] as const;

export const COLORS = {
  correct: '#6aaa64',
  present: '#c9b458',
  absent: '#787c7e',
  empty: '#ffffff',
  border: '#d3d6da',
  darkBorder: '#3a3a3c',
  text: '#1a1a1b',
  darkText: '#ffffff',
} as const;
