import { getRandomWord, isValidWord, analyzeWordFrequency } from '../utils/gameUtils';

/**
 * Word Service - Manages word data and validation
 * Reads from external JSON files for comprehensive word lists
 */
class WordService {
  private commonWords: string[] = [];
  private allWords: string[] = [];
  private isInitialized = false;

  /**
   * Initialize the word service by reading from JSON files
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Try to load words from the JSON files
      const [commonWordsResponse, allWordsResponse] = await Promise.all([
        this.loadJsonFile('../../assets/words/common-words.json'),
        this.loadJsonFile('../../assets/words/all-words.json')
      ]);

      if (commonWordsResponse && allWordsResponse) {
        this.commonWords = commonWordsResponse.filter(word => word && typeof word === 'string');
        this.allWords = allWordsResponse.filter(word => word && typeof word === 'string');
        
        console.log(`Loaded ${this.commonWords.length} common words from JSON`);
        console.log(`Loaded ${this.allWords.length} total words from JSON`);
      } else {
        // Fallback to embedded word list if JSON files can't be loaded
        console.warn('JSON files not accessible, using fallback word list');
        this.initializeFallbackWords();
      }

      this.isInitialized = true;
    } catch (error) {
      console.error('Failed to load words from JSON files, using fallback:', error);
      // Use fallback word list
      this.initializeFallbackWords();
      this.isInitialized = true;
    }
  }

  /**
   * Load JSON file from assets
   */
  private async loadJsonFile(relativePath: string): Promise<string[] | null> {
    try {
      // For React Native, we need to require the JSON files directly
      // This approach works in both development and production builds
      
      if (relativePath.includes('common-words.json')) {
        const commonWords = require('../../assets/words/common-words.json');
        return Array.isArray(commonWords) ? commonWords : null;
      } else if (relativePath.includes('all-words.json')) {
        const allWords = require('../../assets/words/all-words.json');
        return Array.isArray(allWords) ? allWords : null;
      }
      
      return null;
    } catch (error) {
      console.warn(`Could not load ${relativePath}:`, error);
      return null;
    }
  }

  /**
   * Initialize with fallback word list when JSON files are not accessible
   */
  private initializeFallbackWords(): void {
    // Basic common English words for different lengths (fallback)
    this.commonWords = [
      // 3-letter words
      'cat', 'dog', 'run', 'sun', 'fun', 'car', 'boy', 'day', 'way', 'say',
      'may', 'try', 'cry', 'dry', 'fly', 'sky', 'why', 'buy', 'guy', 'pay',
      'lay', 'key', 'joy', 'toy', 'eye', 'bye', 'die', 'lie', 'tie', 'pie',
      'win', 'sin', 'tin', 'bin', 'pin', 'fin', 'big', 'dig', 'fig', 'pig',
      'wig', 'jig', 'rig', 'bad', 'sad', 'mad', 'had', 'dad', 'lad', 'pad',
      'red', 'bed', 'led', 'fed', 'wed', 'net', 'pet', 'set', 'wet', 'get',
      'let', 'met', 'bet', 'jet', 'yet', 'cut', 'but', 'put', 'gut', 'hut',
      'nut', 'rut', 'bat', 'fat', 'hat', 'mat', 'pat', 'rat', 'sat',
      'vat', 'hot', 'pot', 'dot', 'got', 'lot', 'not', 'rot', 'top', 'hop',
      'mop', 'pop', 'cop', 'box', 'fox', 'mix', 'fix', 'six', 'tax', 'wax',
      
      // 4-letter words
      'word', 'work', 'time', 'year', 'back', 'good', 'make', 'take', 'come',
      'give', 'help', 'look', 'find', 'know', 'want', 'need', 'feel', 'seem',
      'like', 'love', 'show', 'tell', 'call', 'talk', 'turn', 'move', 'live',
      'play', 'hear', 'read', 'keep', 'hold', 'open', 'stop', 'walk', 'wait',
      'hope', 'care', 'meet', 'beat', 'heat', 'seat', 'meat', 'neat', 'feet',
      'week', 'seek', 'peek', 'deep', 'weep', 'beep', 'jeep', 'tree',
      'free', 'knee', 'flee', 'thee', 'been', 'seen', 'teen', 'keen', 'lean',
      'mean', 'bean', 'dean', 'jean', 'wean', 'door', 'poor', 'floor', 'soon',
      'moon', 'noon', 'room', 'boom', 'zoom', 'doom', 'loop', 'hoop', 'poop',
      'book', 'took', 'cook', 'hook', 'nook', 'food', 'mood',
      'wood', 'hood', 'cool', 'pool', 'tool', 'fool', 'wool', 'boot', 'foot',
      'root', 'loot', 'hoot', 'shot', 'slot', 'plot', 'spot', 'knot', 'boat',
      'coat', 'goat', 'moat', 'soap', 'rope', 'cope', 'dope',
      'pope', 'mope', 'nope', 'tape', 'cape', 'gape', 'pipe', 'ripe',
      'wipe', 'type', 'hype', 'bike', 'hike', 'pike', 'mike',
      'cake', 'lake', 'wake', 'bake', 'rake', 'fake', 'sake',
      'game', 'name', 'came', 'same', 'fame', 'tame', 'lame', 'dame', 'home',
      'dome', 'rome', 'some', 'tone', 'bone', 'cone', 'done', 'gone',
      'lone', 'none', 'zone', 'phone', 'fire', 'hire', 'tire', 'wire', 'dire',
      'mine', 'line', 'fine', 'wine', 'pine', 'dine', 'nine', 'vine', 'sine',
      
      // 5-letter words
      'about', 'other', 'which', 'their', 'would', 'there', 'could', 'first',
      'after', 'these', 'think', 'where', 'being', 'every', 'great', 'might',
      'shall', 'still', 'those', 'while', 'state', 'never', 'small', 'right',
      'place', 'means', 'again', 'house', 'world', 'three', 'years',
      'water', 'light', 'music', 'heart', 'happy', 'woman', 'money', 'story',
      'young', 'month', 'night', 'point', 'today', 'heard', 'white', 'least',
      'whole', 'human', 'local', 'seems', 'begin', 'since', 'black', 'bring',
      'group', 'early', 'party', 'learn', 'often', 'until',
      'power', 'write', 'voice', 'peace', 'above', 'sound', 'clean',
      'close', 'drive', 'build', 'break', 'speak', 'teach', 'watch', 'start',
      'paper', 'phone', 'radio', 'match', 'catch', 'laugh', 'chair', 'table',
      'board', 'horse', 'mouse', 'court', 'short', 'north', 'south',
      'field', 'piece', 'leave', 'below', 'movie', 'store', 'style',
      'glass', 'grass', 'class', 'cross', 'press', 'dress', 'fresh',
      'flesh', 'guest', 'quest', 'chest', 'crest', 'frost', 'trust', 'twist',
      'blast', 'toast', 'coast', 'beast', 'feast', 'yeast',
      
      // 6-letter words
      'should', 'people', 'little', 'around', 'during', 'within',
      'though', 'family', 'school', 'friend', 'change', 'mother', 'father',
      'rather', 'either', 'person', 'moment', 'number', 'system', 'market',
      'member', 'office', 'police', 'health', 'reason', 'result', 'public',
      'really', 'simply', 'moving', 'living', 'coming', 'taking', 'making',
      'having', 'giving', 'loving', 'trying', 'saying', 'paying', 'buying',
      'flying', 'crying', 'dining', 'mining', 'shining', 'whining',
      'working', 'walking', 'talking', 'looking', 'cooking', 'booking',
      'reading', 'writing', 'playing', 'staying', 'praying', 'spraying',
      'laying',
    ];

    // For all words, we'll include the common words plus some additional ones
    this.allWords = [
      ...this.commonWords,
      // Add more validation words
      'run', 'gun', 'bun', 'nun', 'pun', 'won', 'ton', 'son',
      'men', 'pen', 'hen', 'den', 'ten', 'ben', 'ken', 'len', 'gen', 'yen',
      'add', 'odd', 'cod', 'god', 'mod', 'nod', 'rod', 'sod', 'pod', 'tod',
      'age', 'ace', 'ice', 'ore', 'are', 'use', 'due', 'rue', 'sue', 'cue',
      'hue', 'vue', 'awe', 'owe', 'ewe', 'dew', 'few', 'hew', 'jew', 'new',
      'pew', 'sew', 'yew', 'bow', 'cow', 'how', 'low', 'mow', 'now', 'pow',
      'row', 'sow', 'tow', 'vow', 'wow', 'you', 'zoo', 'boo', 'coo', 'goo',
      'moo', 'poo', 'too', 'woo', 'egg', 'beg', 'keg', 'leg', 'peg',
      'arm', 'dam', 'ham', 'jam', 'ram', 'yam', 'dim', 'gym', 'him', 'rim',
      'sim', 'tim', 'vim', 'hum', 'gum', 'mum', 'rum', 'sum', 'yum', 'bum',
      'can', 'ban', 'dan', 'fan', 'man', 'pan', 'ran', 'tan', 'van', 'wan',
      'bin', 'din', 'gin', 'kin', 'bug', 'dug', 'hug', 'jug', 'lug', 'mug', 'pug', 'rug', 'tug',
      'art', 'eat', 'gat', 'lat', 'nat', 'oat',
      'bit', 'fit', 'git', 'hit', 'kit', 'lit', 'pit', 'sit', 'tit', 'wit', 'zit', 'bot', 'cot',
      'jot', 'but', 'jut', 'tut', 'axe', 'dye', 'lye', 'rye', 'lab', 'cab', 'dab', 'fab', 'gab', 'jab', 'nab',
      'tab', 'orb', 'web', 'rib', 'bib', 'fib', 'jib', 'nib', 'sob', 'bob',
      'cob', 'gob', 'hob', 'job', 'lob', 'mob', 'rob', 'arc', 'orc', 'bid',
      'did', 'hid', 'kid', 'lid', 'rid', 'hod', 'mud', 'bud', 'cud', 'dud', 'pud', 'sud',
      // Common 5-letter words that might be used for testing
      'hello', 'world', 'apple', 'grape', 'plant', 'bread', 'dream', 'steam', 'cream', 'beach', 'teach', 'reach',
      'dance', 'chance', 'prince', 'bridge', 'orange', 'purple',
      'yellow', 'green', 'brown', 'clock', 'block', 'stock',
      'truck', 'brick', 'quick', 'thick', 'stick', 'drink', 'thank',
      'shirt', 'smart', 'sport',
      'earth', 'worth', 'birth', 'death', 'truth', 'youth', 'laugh',
      'tough', 'rough', 'cough', 'fight', 'sight',
    ];

    console.log(`Using fallback word list: ${this.commonWords.length} common words, ${this.allWords.length} total words`);
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