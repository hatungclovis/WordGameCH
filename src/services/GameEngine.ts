import { LetterState, Guess, HintData } from '../types';
import { calculateScore, getAvailableHints, getRandomHint } from '../utils/gameUtils';

/**
 * Game Engine - Handles word matching and game logic
 * Based on the Python WordMatching class and game functions
 */
export class GameEngine {
  /**
   * Check a guess against the target word - equivalent to Python WordMatching.colouredWord()
   * Returns the letter states for each position
   */
  static checkGuess(guess: string, targetWord: string): LetterState[] {
    const guessUpper = guess.toUpperCase();
    const targetUpper = targetWord.toUpperCase();
    const result: LetterState[] = new Array(guess.length).fill('absent');
    
    // Track which letters have been used in the target word
    const targetLetterCounts: Record<string, number> = {};
    const usedTargetPositions = new Set<number>();
    
    // Count all letters in target word
    for (const letter of targetUpper) {
      targetLetterCounts[letter] = (targetLetterCounts[letter] || 0) + 1;
    }
    
    // First pass: Mark correct positions (green) - equivalent to correctCharacters()
    for (let i = 0; i < guessUpper.length; i++) {
      if (guessUpper[i] === targetUpper[i]) {
        result[i] = 'correct';
        targetLetterCounts[guessUpper[i]]--;
        usedTargetPositions.add(i);
      }
    }
    
    // Second pass: Mark present but wrong position (yellow) - equivalent to halfCorrectCharacters()
    for (let i = 0; i < guessUpper.length; i++) {
      if (result[i] === 'absent') {
        const letter = guessUpper[i];
        if (targetLetterCounts[letter] > 0) {
          result[i] = 'present';
          targetLetterCounts[letter]--;
        }
      }
    }
    
    return result;
  }

  /**
   * Create a Guess object with word and states
   */
  static createGuess(word: string, targetWord: string): Guess {
    return {
      word: word.toUpperCase(),
      states: this.checkGuess(word, targetWord),
    };
  }

  /**
   * Calculate game score - equivalent to Python score() function
   */
  static calculateGameScore(
    guesses: Guess[],
    attemptsLeft: number,
    hintsUsed: number = 0
  ): number {
    let correctChars = 0;
    let presentChars = 0;
    
    // Count all correct and present characters from all guesses
    guesses.forEach(guess => {
      guess.states.forEach(state => {
        if (state === 'correct') correctChars++;
        else if (state === 'present') presentChars++;
      });
    });
    
    // Apply hint penalty (optional - not in original Python but good for mobile)
    const hintPenalty = hintsUsed * 0.5;
    
    const baseScore = calculateScore(correctChars, presentChars, attemptsLeft);
    return Math.max(0, baseScore - hintPenalty);
  }

  /**
   * Get available hints for the current game state - equivalent to Python hintCharacters()
   */
  static getAvailableHints(
    targetWord: string,
    guesses: Guess[]
  ): string[] {
    const guessedLetters = new Set<string>();
    const correctPositions = new Set<number>();
    
    // Collect all guessed letters and correct positions
    guesses.forEach(guess => {
      guess.word.split('').forEach((letter, index) => {
        guessedLetters.add(letter);
        if (guess.states[index] === 'correct') {
          correctPositions.add(index);
        }
      });
    });
    
    return getAvailableHints(targetWord, guessedLetters, correctPositions);
  }

  /**
   * Get a random hint - equivalent to Python hintedCharacter()
   */
  static getHint(targetWord: string, guesses: Guess[]): HintData | null {
    const availableHints = this.getAvailableHints(targetWord, guesses);
    const randomLetter = getRandomHint(availableHints);
    
    if (!randomLetter) {
      return null;
    }
    
    // Find a position where this letter appears (optional enhancement)
    const positions = [];
    for (let i = 0; i < targetWord.length; i++) {
      if (targetWord[i].toUpperCase() === randomLetter) {
        positions.push(i);
      }
    }
    
    return {
      letter: randomLetter,
      position: positions.length > 0 ? positions[Math.floor(Math.random() * positions.length)] : undefined,
      revealed: true,
    };
  }

  /**
   * Check if the game is won
   */
  static isGameWon(guess: Guess): boolean {
    return guess.states.every(state => state === 'correct');
  }

  /**
   * Check if the game is lost
   */
  static isGameLost(attemptsLeft: number): boolean {
    return attemptsLeft <= 0;
  }

  /**
   * Get keyboard state based on all guesses - for UI keyboard coloring
   */
  static getKeyboardState(guesses: Guess[]): Record<string, LetterState> {
    const keyboardState: Record<string, LetterState> = {};
    
    guesses.forEach(guess => {
      guess.word.split('').forEach((letter, index) => {
        const currentState = guess.states[index];
        const existingState = keyboardState[letter];
        
        // Priority: correct > present > absent
        if (!existingState || 
            (currentState === 'correct') ||
            (currentState === 'present' && existingState === 'absent')) {
          keyboardState[letter] = currentState;
        }
      });
    });
    
    return keyboardState;
  }

  /**
   * Validate guess format and length
   */
  static isValidGuessFormat(guess: string, targetLength: number): boolean {
    if (!guess || guess.length !== targetLength) {
      return false;
    }
    
    // Check if contains only letters
    return /^[a-zA-Z]+$/.test(guess);
  }

  /**
   * Get game summary for sharing/statistics
   */
  static getGameSummary(
    guesses: Guess[],
    targetWord: string,
    won: boolean,
    score: number,
    difficulty: string,
    hintsUsed: number
  ): {
    attempts: number;
    won: boolean;
    score: number;
    targetWord: string;
    guessWords: string[];
    shareText: string;
  } {
    const attempts = guesses.length;
    const guessWords = guesses.map(g => g.word);
    
    const shareText = `Word Game CH - ${difficulty}
Word: ${targetWord}
${won ? `Solved in ${attempts} attempts` : 'Not solved'}
Score: ${score}
${hintsUsed > 0 ? `Hints used: ${hintsUsed}` : ''}

🎯 Enhanced Word Game`;

    return {
      attempts,
      won,
      score,
      targetWord,
      guessWords,
      shareText,
    };
  }
}

export default GameEngine;
