import { DifficultyLevel, DIFFICULTY_CONFIG } from '../types';

/**
 * Calculate score based on the original Python logic:
 * - Each correct letter: 1 point
 * - Each half-correct letter: 0.5 points  
 * - Each remaining attempt: 3 points
 */
export function calculateScore(
  correctChars: number,
  presentChars: number,
  attemptsLeft: number
): number {
  return correctChars + (presentChars * 0.5) + (attemptsLeft * 3);
}

/**
 * Get maximum attempts based on difficulty level
 */
export function getMaxAttempts(difficulty: DifficultyLevel): number {
  return DIFFICULTY_CONFIG[difficulty].attempts;
}

/**
 * Format time duration in a human-readable format
 */
export function formatDuration(startTime: Date, endTime?: Date): string {
  const end = endTime || new Date();
  const diffMs = end.getTime() - startTime.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);
  const diffSeconds = Math.floor((diffMs % 60000) / 1000);
  
  if (diffMinutes > 0) {
    return `${diffMinutes}m ${diffSeconds}s`;
  }
  return `${diffSeconds}s`;
}

/**
 * Generate a random word from a list of words with specific length
 */
export function getRandomWord(words: string[], length: number): string {
  const filteredWords = words.filter(word => word.length === length);
  if (filteredWords.length === 0) {
    throw new Error(`No words found with length ${length}`);
  }
  return filteredWords[Math.floor(Math.random() * filteredWords.length)];
}

/**
 * Check if a word is valid (exists in the word list)
 */
export function isValidWord(word: string, wordList: string[]): boolean {
  return wordList.includes(word.toLowerCase());
}

/**
 * Get available hint letters (letters in target word not yet guessed correctly)
 */
export function getAvailableHints(
  targetWord: string,
  guessedLetters: Set<string>,
  correctPositions: Set<number>
): string[] {
  const hints: string[] = [];
  
  for (let i = 0; i < targetWord.length; i++) {
    const letter = targetWord[i].toUpperCase();
    
    // Only include if letter hasn't been guessed and position isn't correct
    if (!guessedLetters.has(letter) && !correctPositions.has(i)) {
      if (!hints.includes(letter)) {
        hints.push(letter);
      }
    }
  }
  
  return hints;
}

/**
 * Get a random hint letter
 */
export function getRandomHint(availableHints: string[]): string | null {
  if (availableHints.length === 0) return null;
  return availableHints[Math.floor(Math.random() * availableHints.length)];
}

/**
 * Share game results in a formatted string (like original Wordle)
 */
export function formatShareText(
  difficulty: DifficultyLevel,
  wordLength: number,
  attempts: number,
  maxAttempts: number,
  won: boolean,
  score: number
): string {
  const difficultyLabel = DIFFICULTY_CONFIG[difficulty].label;
  const result = won ? `${attempts}/${maxAttempts}` : 'X/6';
  
  return `Word Game CH - ${difficultyLabel}
Word Length: ${wordLength}
Result: ${result}
Score: ${score}

🎯 Enhanced Word Game by Clovis`;
}

/**
 * Validate word length is within acceptable range
 */
export function isValidWordLength(length: number): boolean {
  return length >= 3 && length <= 14;
}

/**
 * Debounce function for search/input
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Generate letter frequency analysis like in the Python version
 */
export function analyzeWordFrequency(words: string[]): {
  byLength: Record<number, number>;
  byFirstLetter: Record<string, number>;
} {
  const byLength: Record<number, number> = {};
  const byFirstLetter: Record<string, number> = {};
  
  words.forEach(word => {
    // Count by length
    const length = word.length;
    byLength[length] = (byLength[length] || 0) + 1;
    
    // Count by first letter
    const firstLetter = word[0].toLowerCase();
    byFirstLetter[firstLetter] = (byFirstLetter[firstLetter] || 0) + 1;
  });
  
  return { byLength, byFirstLetter };
}
