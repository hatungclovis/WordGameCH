import { getRandomWord, isValidWord, analyzeWordFrequency } from '../utils/gameUtils';

/**
 * Word Service - Manages word data and validation
 * 
 * SIMPLE ARCHITECTURE:
 * 1. Load bundled .json files (common-words.json, all-words.json) from assets/words
 * 2. NO DOWNLOADS - pure offline operation with bundled files only
 * 3. Show error message if files are missing or corrupted
 */
class WordService {
  private commonWords: string[] = []; // Gameplay words from common-words.json
  private allWords: string[] = [];    // Validation words from all-words.json
  private isInitialized = false;
  private initializationError: string | null = null;

  /**
   * Initialize the word service
   * Loads .json files directly from assets/words
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) {
      if (this.initializationError) {
        throw new Error(this.initializationError);
      }
      return;
    }

    console.log('🔄 Initializing WordService...');
    
    try {
      // Load word files using direct imports (works in React Native)
      const [commonWordsData, allWordsData] = await Promise.all([
        this.loadCommonWords(),
        this.loadAllWords()
      ]);

      // Validate loaded data
      if (!commonWordsData || !Array.isArray(commonWordsData) || commonWordsData.length === 0) {
        throw new Error('Common words file is missing, corrupted, or empty');
      }

      if (!allWordsData || !Array.isArray(allWordsData) || allWordsData.length === 0) {
        throw new Error('All words file is missing, corrupted, or empty');
      }

      // Process and validate words
      this.commonWords = commonWordsData
        .filter(word => word && typeof word === 'string' && word.trim().length > 0)
        .map(word => word.trim().toLowerCase())
        .filter(word => /^[a-z]+$/.test(word)); // Only alphabetic characters

      this.allWords = allWordsData
        .filter(word => word && typeof word === 'string' && word.trim().length > 0)
        .map(word => word.trim().toLowerCase())
        .filter(word => /^[a-z]+$/.test(word)); // Only alphabetic characters

      // Final validation
      if (this.commonWords.length < 100) {
        throw new Error(`Common words file appears corrupted: only ${this.commonWords.length} valid words found`);
      }

      if (this.allWords.length < 10000) {
        throw new Error(`All words file appears corrupted: only ${this.allWords.length} valid words found`);
      }

      this.isInitialized = true;
      this.initializationError = null;
      
      console.log('✅ WordService initialized successfully:', {
        gameplayWords: this.commonWords.length,
        validationWords: this.allWords.length
      });

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error loading word files';
      this.initializationError = `Word files are missing or corrupted. Please download the most updated version of the game. Error: ${errorMessage}`;
      
      console.error('❌ WordService initialization failed:', this.initializationError);
      
      // Set initialized to true to prevent repeated attempts
      this.isInitialized = true;
      
      throw new Error(this.initializationError);
    }
  }

  /**
   * Load common words from bundled JSON file
   */
  private async loadCommonWords(): Promise<string[] | null> {
    try {
      // Import the JSON file directly (this works in React Native with bundled assets)
      const commonWords = require('../../assets/words/common-words.json');
      return Array.isArray(commonWords) ? commonWords : null;
    } catch (error) {
      console.warn('Could not load common-words.json:', error);
      return null;
    }
  }

  /**
   * Load all words from bundled JSON file
   */
  private async loadAllWords(): Promise<string[] | null> {
    try {
      // Import the JSON file directly (this works in React Native with bundled assets)
      const allWords = require('../../assets/words/all-words.json');
      return Array.isArray(allWords) ? allWords : null;
    } catch (error) {
      console.warn('Could not load all-words.json:', error);
      return null;
    }
  }

  /**
   * Get words filtered by length (ONLY from common words)
   */
  getWordsByLength(length: number): string[] {
    this.ensureInitialized();
    const filteredWords = this.commonWords.filter(word => word.length === length);
    
    if (filteredWords.length === 0) {
      throw new Error(`No gameplay words found with length ${length}`);
    }
    
    return filteredWords;
  }

  /**
   * Get a random word of specific length (ONLY from common words)
   */
  getRandomWordByLength(length: number): string {
    const words = this.getWordsByLength(length);
    return getRandomWord(words, length).toUpperCase();
  }

  /**
   * Validate if a word exists in our comprehensive dictionary
   */
  isValidWord(word: string): boolean {
    this.ensureInitialized();
    
    if (!word || typeof word !== 'string') {
      return false;
    }
    
    const normalizedWord = word.toLowerCase().trim();
    
    // Check against comprehensive validation dictionary
    return this.allWords.includes(normalizedWord);
  }

  /**
   * Get word frequency analysis (from gameplay words only)
   */
  getWordAnalysis(): {
    byLength: Record<number, number>;
    byFirstLetter: Record<string, number>;
  } {
    this.ensureInitialized();
    return analyzeWordFrequency(this.commonWords);
  }

  /**
   * Get all common words (gameplay words only)
   */
  getAllCommonWords(): string[] {
    this.ensureInitialized();
    return [...this.commonWords];
  }

  /**
   * Get all words (validation dictionary)
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
    source: 'json';
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
      source: 'json',
    };
  }

  /**
   * Check if word length is available in gameplay words
   */
  isWordLengthAvailable(length: number): boolean {
    this.ensureInitialized();
    return this.commonWords.some(word => word.length === length);
  }

  /**
   * Get word count for specific length (from gameplay words)
   */
  getWordCountByLength(length: number): number {
    this.ensureInitialized();
    return this.commonWords.filter(word => word.length === length).length;
  }

  /**
   * Check if the service has been initialized successfully
   */
  isServiceReady(): boolean {
    return this.isInitialized && !this.initializationError;
  }

  /**
   * Get initialization error message if any
   */
  getInitializationError(): string | null {
    return this.initializationError;
  }

  /**
   * Private method to ensure service is initialized
   */
  private ensureInitialized(): void {
    if (!this.isInitialized) {
      throw new Error('WordService not initialized. Call initialize() first.');
    }
    
    if (this.initializationError) {
      throw new Error(this.initializationError);
    }
  }
}

// Export singleton instance
export const wordService = new WordService();
export default WordService;