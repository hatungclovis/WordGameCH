import commonWordsData from '../../assets/words/common-words.json';
import allWordsData from '../../assets/words/all-words.json';
import { getRandomWord, isValidWord, analyzeWordFrequency } from '../utils/gameUtils';

/**
 * Word Service - Manages word data and validation
 * Based on the Python classes: ScrapeCommonWords, ScrapeAllWords, Library
 */
class WordService {
  private commonWords: string[] = [];
  private allWords: string[] = [];
  private isInitialized = false;

  /**
   * Initialize the word service - equivalent to Python Library class
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load common words (equivalent to readCommonWordsFile)
      this.commonWords = commonWordsData.map(word => word.toLowerCase());
      console.log(`Loaded ${this.commonWords.length} common words`);

      // Load all words (equivalent to readAllWordsFile)
      this.allWords = allWordsData.map(word => word.toLowerCase());
      console.log(`Loaded ${this.allWords.length} total words`);

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to initialize word service:', error);
      throw new Error('Failed to load word data');
    }
  }

  /**
   * Get words filtered by length - equivalent to Python desiredWordsList function
   */
  getWordsByLength(length: number): string[] {
    this.ensureInitialized();
    const filteredWords = this.commonWords.filter(word => word.length === length);
    
    if (filteredWords.length === 0) {
      throw new Error(`No common words found with length ${length}`);
    }
    
    return filteredWords;
  }

  /**
   * Get a random word of specific length - equivalent to Python secretWord function
   */
  getRandomWordByLength(length: number): string {
    const words = this.getWordsByLength(length);
    return getRandomWord(words, length).toUpperCase();
  }

  /**
   * Validate if a word exists in our dictionary - equivalent to Python word validation
   */
  isValidWord(word: string): boolean {
    this.ensureInitialized();
    return isValidWord(word, this.allWords);
  }

  /**
   * Get word frequency analysis - equivalent to Python miscellaneous functions
   */
  getWordAnalysis(): {
    byLength: Record<number, number>;
    byFirstLetter: Record<string, number>;
  } {
    this.ensureInitialized();
    return analyzeWordFrequency(this.commonWords);
  }

  /**
   * Get all common words
   */
  getAllCommonWords(): string[] {
    this.ensureInitialized();
    return [...this.commonWords];
  }

  /**
   * Get all words
   */
  getAllWords(): string[] {
    this.ensureInitialized();
    return [...this.allWords];
  }

  /**
   * Get word statistics
   */
  getWordStatistics(): {
    totalCommonWords: number;
    totalAllWords: number;
    lengthRange: { min: number; max: number };
    availableLengths: number[];
  } {
    this.ensureInitialized();
    
    const lengths = this.commonWords.map(word => word.length);
    const uniqueLengths = [...new Set(lengths)].sort((a, b) => a - b);
    
    return {
      totalCommonWords: this.commonWords.length,
      totalAllWords: this.allWords.length,
      lengthRange: {
        min: Math.min(...lengths),
        max: Math.max(...lengths),
      },
      availableLengths: uniqueLengths,
    };
  }

  /**
   * Check if word length is available in our dataset
   */
  isWordLengthAvailable(length: number): boolean {
    this.ensureInitialized();
    return this.commonWords.some(word => word.length === length);
  }

  /**
   * Get word count for specific length
   */
  getWordCountByLength(length: number): number {
    this.ensureInitialized();
    return this.commonWords.filter(word => word.length === length).length;
  }

  /**
   * Private method to ensure service is initialized
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('WordService not initialized. Call initialize() first.');
    }
  }
}

// Export singleton instance
export const wordService = new WordService();
export default WordService;
