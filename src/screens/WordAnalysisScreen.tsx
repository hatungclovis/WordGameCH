import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  ActivityIndicator,
  Modal,
  FlatList,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useGameStore } from '../services/gameStore';
import { wordService } from '../services/WordService';

type WordAnalysisScreenNavigationProp = StackNavigationProp<RootStackParamList, 'WordAnalysis'>;

interface Props {
  navigation: WordAnalysisScreenNavigationProp;
}

const { width: screenWidth } = Dimensions.get('window');

interface WordAnalysis {
  byLength: Record<number, number>;
  byFirstLetter: Record<string, number>;
}

export default function WordAnalysisScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { settings } = useGameStore();
  const [analysis, setAnalysis] = useState<WordAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalWords, setModalWords] = useState<string[]>([]);
  const [modalTitle, setModalTitle] = useState('');

  const headerHeight = Math.max(60, insets.top + 40);

  useEffect(() => {
    loadWordAnalysis();
  }, []);

  const loadWordAnalysis = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Ensure word service is initialized
      if (!wordService.isServiceReady()) {
        await wordService.initialize();
      }
      
      // Get word analysis
      const wordAnalysis = wordService.getWordAnalysis();
      setAnalysis(wordAnalysis);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load word analysis';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const showWordsModal = (words: string[], title: string) => {
    setModalWords(words);
    setModalTitle(title);
    setModalVisible(true);
  };

  const getWordsByLength = (length: number): string[] => {
    const allWords = wordService.getAllCommonWords();
    return allWords.filter(word => word.length === length);
  };

  const getWordsByFirstLetter = (letter: string): string[] => {
    const allWords = wordService.getAllCommonWords();
    return allWords.filter(word => word.toLowerCase().startsWith(letter.toLowerCase()));
  };

  const renderLengthChart = () => {
    if (!analysis) return null;
    
    const maxCount = Math.max(...Object.values(analysis.byLength));
    const sortedLengths = Object.entries(analysis.byLength)
      .sort(([a], [b]) => parseInt(a) - parseInt(b));
    
    return (
      <View style={[styles.chartSection, settings.darkMode && styles.darkCard]}>
        <Text style={[styles.chartTitle, settings.darkMode && styles.darkText]}>
          📊 Distribution of words by their number of letters
        </Text>
        <Text style={[styles.chartExplanation, settings.darkMode && styles.darkSubtext]}>
          Word length is the number of letters in a word. E.g. The word "come" has a word length of 4 because it has four letters.
        </Text>
        <Text style={[styles.chartSubtitle, settings.darkMode && styles.darkSubtext]}>
          Tap on any bar to see words with that length
        </Text>
        
        <View style={styles.chartContainer}>
          {sortedLengths.map(([length, count]) => {
            const percentage = (count / maxCount) * 100;
            const lengthNum = parseInt(length);
            
            return (
              <TouchableOpacity
                key={length}
                style={styles.barRow}
                onPress={() => {
                  const words = getWordsByLength(lengthNum);
                  showWordsModal(words, `Words with ${length} letters`);
                }}
                activeOpacity={0.7}
              >
                <Text style={[styles.barLabel, settings.darkMode && styles.darkText]}>
                  {length}
                </Text>
                <View style={styles.barContainer}>
                  <View 
                    style={[
                      styles.bar,
                      { 
                        width: `${percentage}%`,
                        backgroundColor: getBarColor(lengthNum),
                      }
                    ]} 
                  />
                  <Text style={[styles.barCount, settings.darkMode && styles.darkText]}>
                    {count}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
        
        <Text style={[styles.insights, settings.darkMode && styles.darkSubtext]}>
          💡 Words with 4-7 letters are most common, making them good choices for beginners!
        </Text>
      </View>
    );
  };

  const renderFirstLetterChart = () => {
    if (!analysis) return null;
    
    const maxCount = Math.max(...Object.values(analysis.byFirstLetter));
    const sortedLetters = Object.entries(analysis.byFirstLetter)
      .sort(([a], [b]) => a.localeCompare(b));
    
    return (
      <View style={[styles.chartSection, settings.darkMode && styles.darkCard]}>
        <Text style={[styles.chartTitle, settings.darkMode && styles.darkText]}>
          🔤 Words by First Letter Distribution
        </Text>
        <Text style={[styles.chartSubtitle, settings.darkMode && styles.darkSubtext]}>
          Tap on any letter to see words starting with that letter
        </Text>
        
        <View style={styles.letterGrid}>
          {sortedLetters.map(([letter, count]) => {
            const percentage = (count / maxCount) * 100;
            
            return (
              <TouchableOpacity
                key={letter}
                style={styles.letterCard}
                onPress={() => {
                  const words = getWordsByFirstLetter(letter);
                  showWordsModal(words, `Words starting with "${letter.toUpperCase()}"`);
                }}
                activeOpacity={0.7}
              >
                <View style={[styles.letterCircle, settings.darkMode && styles.darkLetterCircle]}>
                  <Text style={[styles.letterText, settings.darkMode && styles.darkText]}>
                    {letter.toUpperCase()}
                  </Text>
                </View>
                <View style={styles.letterBar}>
                  <View 
                    style={[
                      styles.letterBarFill,
                      { 
                        width: `${percentage}%`,
                        backgroundColor: getLetterBarColor(letter),
                      }
                    ]} 
                  />
                </View>
                <Text style={[styles.letterCount, settings.darkMode && styles.darkText]}>
                  {count}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
        
        <View style={styles.letterInsights}>
          <Text style={[styles.insights, settings.darkMode && styles.darkSubtext]}>
            💡 Most common starting letters: S, C, P, B, M, A, T
          </Text>
          <Text style={[styles.insights, settings.darkMode && styles.darkSubtext]}>
            💡 Least common starting letters: Q, X, Z, J
          </Text>
        </View>
      </View>
    );
  };

  const renderWordsModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, settings.darkMode && styles.darkModalContent]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, settings.darkMode && styles.darkText]}>
                {modalTitle}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={modalWords}
              keyExtractor={(item, index) => `${item}-${index}`}
              numColumns={2}
              showsVerticalScrollIndicator={true}
              contentContainerStyle={styles.wordsList}
              renderItem={({ item }) => (
                <View style={[styles.wordItem, settings.darkMode && styles.darkWordItem]}>
                  <Text style={[styles.wordText, settings.darkMode && styles.darkText]}>
                    {item.toUpperCase()}
                  </Text>
                </View>
              )}
            />
            
            <View style={styles.modalFooter}>
              <Text style={[styles.modalFooterText, settings.darkMode && styles.darkSubtext]}>
                Total: {modalWords.length} words
              </Text>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  const getBarColor = (length: number): string => {
    if (length <= 3) return '#ff6b6b';
    if (length <= 5) return '#4ecdc4';
    if (length <= 7) return '#45b7d1';
    if (length <= 9) return '#96ceb4';
    return '#ffeaa7';
  };

  const getLetterBarColor = (letter: string): string => {
    const colors = [
      '#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7',
      '#dda0dd', '#98d8c8', '#f7dc6f', '#bb8fce', '#85c1e9',
      '#f8c471', '#82e0aa', '#f1948a', '#85c1e9', '#f4d03f',
      '#bb8fce', '#7fb3d3', '#f8c471', '#a3e4d7', '#fadbd8',
      '#d5dbdb', '#e8daef', '#d6eaf8', '#fcf3cf', '#e8f8f5',
      '#fdf2e9'
    ];
    return colors[letter.charCodeAt(0) - 97] || '#6aaa64';
  };

  if (loading) {
    return (
      <View style={[styles.container, settings.darkMode && styles.darkContainer]}>
        <View style={[styles.loadingContainer, { paddingTop: insets.top + 20 }]}>
          <ActivityIndicator size="large" color="#6aaa64" />
          <Text style={[styles.loadingText, settings.darkMode && styles.darkText]}>
            Analyzing word patterns...
          </Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, settings.darkMode && styles.darkContainer]}>
        <View style={[styles.errorContainer, { paddingTop: insets.top + 20 }]}>
          <Text style={[styles.errorText, settings.darkMode && styles.darkText]}>
            {error}
          </Text>
          <TouchableOpacity style={styles.retryButton} onPress={loadWordAnalysis}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, settings.darkMode && styles.darkContainer]}>
      {/* Custom Header with Safe Area */}
      <View style={[
        styles.header, 
        settings.darkMode && styles.darkHeader,
        { 
          paddingTop: insets.top + 10,
          minHeight: headerHeight,
        }
      ]}>
        <View style={styles.headerContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={[styles.backButtonText, settings.darkMode && styles.darkText]}>← Back</Text>
          </TouchableOpacity>
          
          <Text style={[styles.headerTitle, settings.darkMode && styles.darkText]}>
            Word Analysis
          </Text>
          
          <View style={styles.spacer} />
        </View>
      </View>

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: 100 } // Space for sticky button
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.introSection}>
          <Text style={[styles.introTitle, settings.darkMode && styles.darkText]}>
            📚 Dictionary Insights
          </Text>
          <Text style={[styles.introText, settings.darkMode && styles.darkSubtext]}>
            Understanding word patterns can help you choose better word lengths and make smarter guesses. 
            This analysis is based on {analysis ? Object.values(analysis.byLength).reduce((a, b) => a + b, 0).toLocaleString() : 0} common English words.
          </Text>
        </View>

        {renderLengthChart()}
        {renderFirstLetterChart()}
      </ScrollView>

      {/* Sticky Start Playing Button */}
      <View style={[
        styles.stickyButtonContainer, 
        settings.darkMode && styles.darkStickyContainer,
        { paddingBottom: Math.max(insets.bottom, 20) }
      ]}>
        <TouchableOpacity 
          style={styles.playButton} 
          onPress={() => navigation.navigate('Home')}
        >
          <Text style={styles.playButtonText}>🎮 Start Playing</Text>
        </TouchableOpacity>
      </View>

      {renderWordsModal()}
    </View>
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
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
    backgroundColor: '#ffffff',
    justifyContent: 'flex-end',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'baseline',
    height: 44,
  },
  darkHeader: {
    borderBottomColor: '#3a3a3c',
    backgroundColor: '#1a1a1b',
  },
  backButton: {
    paddingRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1a1a1b',
    fontWeight: 'bold',
  },
  headerTitle: {
    flex: 1,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1b',
    textAlign: 'center',
  },
  spacer: {
    width: 60,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  darkText: {
    color: '#ffffff',
  },
  darkSubtext: {
    color: '#a0a0a0',
  },
  darkCard: {
    backgroundColor: '#2a2a2c',
  },
  darkLetterCircle: {
    backgroundColor: '#3a3a3c',
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
    fontSize: 16,
    color: '#d73a49',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: '#6aaa64',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  introSection: {
    marginBottom: 30,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1b',
    marginBottom: 10,
  },
  introText: {
    fontSize: 16,
    color: '#787c7e',
    lineHeight: 24,
  },
  chartSection: {
    backgroundColor: '#f6f7f8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 25,
  },
  chartTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1a1a1b',
    marginBottom: 8,
  },
  chartExplanation: {
    fontSize: 14,
    color: '#787c7e',
    marginBottom: 12,
    lineHeight: 20,
  },
  chartSubtitle: {
    fontSize: 14,
    color: '#787c7e',
    marginBottom: 20,
    fontStyle: 'italic',
  },
  chartContainer: {
    marginBottom: 15,
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    paddingVertical: 4,
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  barLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1b',
    width: 30,
  },
  barContainer: {
    flex: 1,
    height: 32,
    backgroundColor: '#e5e5e5',
    borderRadius: 6,
    marginLeft: 10,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  bar: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    borderRadius: 6,
    minWidth: 20,
  },
  barCount: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1b',
    textAlign: 'right',
  },
  letterGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  letterCard: {
    width: (screenWidth - 80) / 6,
    alignItems: 'center',
    marginBottom: 15,
    paddingVertical: 4,
    borderRadius: 8,
  },
  letterCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#e5e5e5',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  letterText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1a1a1b',
  },
  letterBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#e5e5e5',
    borderRadius: 2,
    marginBottom: 3,
  },
  letterBarFill: {
    height: '100%',
    borderRadius: 2,
  },
  letterCount: {
    fontSize: 12,
    color: '#1a1a1b',
    textAlign: 'center',
  },
  letterInsights: {
    marginTop: 10,
  },
  insights: {
    fontSize: 14,
    color: '#787c7e',
    lineHeight: 20,
    marginBottom: 5,
  },
  stickyButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  darkStickyContainer: {
    backgroundColor: '#1a1a1b',
    borderTopColor: '#3a3a3c',
  },
  playButton: {
    backgroundColor: '#6aaa64',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    width: '100%',
    maxHeight: '80%',
    padding: 0,
  },
  darkModalContent: {
    backgroundColor: '#2a2a2c',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1b',
    flex: 1,
    textAlign: 'center',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 10,
  },
  closeButtonText: {
    fontSize: 16,
    color: '#666',
  },
  wordsList: {
    padding: 20,
  },
  wordItem: {
    flex: 0.48,
    backgroundColor: '#f6f7f8',
    borderRadius: 8,
    padding: 12,
    margin: '1%',
    alignItems: 'center',
  },
  darkWordItem: {
    backgroundColor: '#3a3a3c',
  },
  wordText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1a1a1b',
  },
  modalFooter: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    alignItems: 'center',
  },
  modalFooterText: {
    fontSize: 14,
    color: '#787c7e',
  },
});
