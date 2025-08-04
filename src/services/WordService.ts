import { getRandomWord, isValidWord, analyzeWordFrequency } from '../utils/gameUtils';

// Import common words directly
import commonWordsData from '../../assets/words/common-words.json';

// Import all word files statically (React Native requires static imports)
import words_001 from '../../assets/words/all_words/words_001.json';
import words_002 from '../../assets/words/all_words/words_002.json';
import words_003 from '../../assets/words/all_words/words_003.json';
import words_004 from '../../assets/words/all_words/words_004.json';
import words_005 from '../../assets/words/all_words/words_005.json';
import words_006 from '../../assets/words/all_words/words_006.json';
import words_007 from '../../assets/words/all_words/words_007.json';
import words_008 from '../../assets/words/all_words/words_008.json';
import words_009 from '../../assets/words/all_words/words_009.json';
import words_010 from '../../assets/words/all_words/words_010.json';
import words_011 from '../../assets/words/all_words/words_011.json';
import words_012 from '../../assets/words/all_words/words_012.json';
import words_013 from '../../assets/words/all_words/words_013.json';
import words_014 from '../../assets/words/all_words/words_014.json';
import words_015 from '../../assets/words/all_words/words_015.json';
import words_016 from '../../assets/words/all_words/words_016.json';
import words_017 from '../../assets/words/all_words/words_017.json';
import words_018 from '../../assets/words/all_words/words_018.json';
import words_019 from '../../assets/words/all_words/words_019.json';
import words_020 from '../../assets/words/all_words/words_020.json';
import words_021 from '../../assets/words/all_words/words_021.json';
import words_022 from '../../assets/words/all_words/words_022.json';
import words_023 from '../../assets/words/all_words/words_023.json';
import words_024 from '../../assets/words/all_words/words_024.json';
import words_025 from '../../assets/words/all_words/words_025.json';
import words_026 from '../../assets/words/all_words/words_026.json';
import words_027 from '../../assets/words/all_words/words_027.json';
import words_028 from '../../assets/words/all_words/words_028.json';
import words_029 from '../../assets/words/all_words/words_029.json';
import words_030 from '../../assets/words/all_words/words_030.json';
import words_031 from '../../assets/words/all_words/words_031.json';
import words_032 from '../../assets/words/all_words/words_032.json';
import words_033 from '../../assets/words/all_words/words_033.json';
import words_034 from '../../assets/words/all_words/words_034.json';
import words_035 from '../../assets/words/all_words/words_035.json';
import words_036 from '../../assets/words/all_words/words_036.json';
import words_037 from '../../assets/words/all_words/words_037.json';
import words_038 from '../../assets/words/all_words/words_038.json';
import words_039 from '../../assets/words/all_words/words_039.json';
import words_040 from '../../assets/words/all_words/words_040.json';
import words_041 from '../../assets/words/all_words/words_041.json';
import words_042 from '../../assets/words/all_words/words_042.json';
import words_043 from '../../assets/words/all_words/words_043.json';
import words_044 from '../../assets/words/all_words/words_044.json';
import words_045 from '../../assets/words/all_words/words_045.json';
import words_046 from '../../assets/words/all_words/words_046.json';
import words_047 from '../../assets/words/all_words/words_047.json';
import words_048 from '../../assets/words/all_words/words_048.json';
import words_049 from '../../assets/words/all_words/words_049.json';
import words_050 from '../../assets/words/all_words/words_050.json';
import words_051 from '../../assets/words/all_words/words_051.json';
import words_052 from '../../assets/words/all_words/words_052.json';
import words_053 from '../../assets/words/all_words/words_053.json';
import words_054 from '../../assets/words/all_words/words_054.json';
import words_055 from '../../assets/words/all_words/words_055.json';
import words_056 from '../../assets/words/all_words/words_056.json';
import words_057 from '../../assets/words/all_words/words_057.json';
import words_058 from '../../assets/words/all_words/words_058.json';
import words_059 from '../../assets/words/all_words/words_059.json';
import words_060 from '../../assets/words/all_words/words_060.json';
import words_061 from '../../assets/words/all_words/words_061.json';
import words_062 from '../../assets/words/all_words/words_062.json';
import words_063 from '../../assets/words/all_words/words_063.json';
import words_064 from '../../assets/words/all_words/words_064.json';
import words_065 from '../../assets/words/all_words/words_065.json';
import words_066 from '../../assets/words/all_words/words_066.json';
import words_067 from '../../assets/words/all_words/words_067.json';
import words_068 from '../../assets/words/all_words/words_068.json';
import words_069 from '../../assets/words/all_words/words_069.json';
import words_070 from '../../assets/words/all_words/words_070.json';
import words_071 from '../../assets/words/all_words/words_071.json';
import words_072 from '../../assets/words/all_words/words_072.json';
import words_073 from '../../assets/words/all_words/words_073.json';
import words_074 from '../../assets/words/all_words/words_074.json';
import words_075 from '../../assets/words/all_words/words_075.json';

// Combine all word files into an array
const allWordFiles = [
  words_001, words_002, words_003, words_004, words_005,
  words_006, words_007, words_008, words_009, words_010,
  words_011, words_012, words_013, words_014, words_015,
  words_016, words_017, words_018, words_019, words_020,
  words_021, words_022, words_023, words_024, words_025,
  words_026, words_027, words_028, words_029, words_030,
  words_031, words_032, words_033, words_034, words_035,
  words_036, words_037, words_038, words_039, words_040,
  words_041, words_042, words_043, words_044, words_045,
  words_046, words_047, words_048, words_049, words_050,
  words_051, words_052, words_053, words_054, words_055,
  words_056, words_057, words_058, words_059, words_060,
  words_061, words_062, words_063, words_064, words_065,
  words_066, words_067, words_068, words_069, words_070,
  words_071, words_072, words_073, words_074, words_075
];

/**
 * Word Service - Manages word data and validation
 * 
 * ENHANCED ARCHITECTURE:
 * 1. Load bundled .json files (common-words.json, all_words folder with 75 files) from assets/words
 * 2. NO DOWNLOADS - pure offline operation with bundled files only
 * 3. Show error message if files are missing or corrupted
 * 4. Combines multiple word files into single validation dictionary
 */
class WordService {
  private commonWords: string[] = []; // Gameplay words from common-words.json
  private allWords: string[] = [];    // Validation words from all_words folder (75 files combined)
  private isInitialized = false;
  private initializationError: string | null = null;

  /**
   * Initialize the word service
   * Loads .json files directly from assets/words including all files in all_words folder
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
      // Load word files using static imports (works in React Native)
      const [commonWordsData, allWordsData] = await Promise.all([
        this.loadCommonWords(),
        this.loadAllWords()
      ]);

      // Validate loaded data
      if (!commonWordsData || !Array.isArray(commonWordsData) || commonWordsData.length === 0) {
        throw new Error('Common words file is missing, corrupted, or empty');
      }

      if (!allWordsData || !Array.isArray(allWordsData) || allWordsData.length === 0) {
        throw new Error('All words files are missing, corrupted, or empty');
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
        throw new Error(`All words files appear corrupted: only ${this.allWords.length} valid words found`);
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
      // Use the statically imported data
      return Array.isArray(commonWordsData) ? commonWordsData : null;
    } catch (error) {
      console.warn('Could not load common-words.json:', error);
      return null;
    }
  }

  /**
   * Load all words from multiple bundled JSON files in all_words folder
   */
  private async loadAllWords(): Promise<string[] | null> {
    try {
      const allWords: string[] = [];
      let loadedFiles = 0;
      let failedFiles = 0;

      // Process all statically imported word files
      for (let i = 0; i < allWordFiles.length; i++) {
        try {
          const wordsFromFile = allWordFiles[i];
          
          if (Array.isArray(wordsFromFile)) {
            allWords.push(...wordsFromFile);
            loadedFiles++;
          } else {
            console.warn(`File ${i + 1} does not contain an array`);
            failedFiles++;
          }
        } catch (fileError) {
          console.warn(`Could not process file ${i + 1}:`, fileError);
          failedFiles++;
        }
      }

      console.log(`📂 Word files loaded: ${loadedFiles}/${allWordFiles.length} successful, ${failedFiles} failed`);

      // Return the combined words if we successfully loaded at least some files
      if (loadedFiles > 0 && allWords.length > 0) {
        // Remove duplicates (just in case) and return
        const uniqueWords = [...new Set(allWords)];
        console.log(`📝 Total words loaded: ${uniqueWords.length} (${allWords.length - uniqueWords.length} duplicates removed)`);
        return uniqueWords;
      } else {
        console.error('No word files could be loaded successfully');
        return null;
      }
    } catch (error) {
      console.warn('Could not load word files from all_words folder:', error);
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