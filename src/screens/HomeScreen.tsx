import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useGameStore } from '../services/gameStore';
import { DifficultyLevel, DIFFICULTY_CONFIG, WORD_LENGTH_OPTIONS } from '../types';

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: Props) {
  const { settings, updateSettings, statistics } = useGameStore();
  const [selectedDifficulty, setSelectedDifficulty] = React.useState<DifficultyLevel>(
    settings.difficulty
  );
  const [selectedWordLength, setSelectedWordLength] = React.useState(settings.wordLength);

  const startGame = () => {
    updateSettings({
      difficulty: selectedDifficulty,
      wordLength: selectedWordLength,
    });

    navigation.navigate('Game', {
      difficulty: selectedDifficulty,
      wordLength: selectedWordLength,
    });
  };

  const navigateToStats = () => {
    navigation.navigate('Stats');
  };

  const navigateToSettings = () => {
    navigation.navigate('Settings');
  };

  return (
    <SafeAreaView style={[styles.container, settings.darkMode && styles.darkContainer]}>
      <ScrollView contentContainerStyle={styles.content}>
        {/* Title */}
        <Text style={[styles.title, settings.darkMode && styles.darkText]}>
          Word Game CH
        </Text>
        <Text style={[styles.subtitle, settings.darkMode && styles.darkText]}>
          Enhanced Version
        </Text>

        {/* Quick Stats */}
        {statistics.gamesPlayed > 0 && (
          <View style={[styles.statsContainer, settings.darkMode && styles.darkCard]}>
            <Text style={[styles.statsTitle, settings.darkMode && styles.darkText]}>
              Quick Stats
            </Text>
            <View style={styles.statsRow}>
              <Text style={[styles.statLabel, settings.darkMode && styles.darkText]}>
                Games Played: {statistics.gamesPlayed}
              </Text>
              <Text style={[styles.statLabel, settings.darkMode && styles.darkText]}>
                Win Rate: {statistics.winPercentage.toFixed(1)}%
              </Text>
            </View>
            <TouchableOpacity style={styles.viewStatsButton} onPress={navigateToStats}>
              <Text style={styles.viewStatsText}>View All Statistics</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Difficulty Selection */}
        <View style={[styles.section, settings.darkMode && styles.darkCard]}>
          <Text style={[styles.sectionTitle, settings.darkMode && styles.darkText]}>
            Difficulty Level
          </Text>
          <View style={styles.buttonRow}>
            {(Object.keys(DIFFICULTY_CONFIG) as DifficultyLevel[]).map((difficulty) => (
              <TouchableOpacity
                key={difficulty}
                style={[
                  styles.difficultyButton,
                  selectedDifficulty === difficulty && styles.selectedButton,
                ]}
                onPress={() => setSelectedDifficulty(difficulty)}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    selectedDifficulty === difficulty && styles.selectedText,
                  ]}
                >
                  {DIFFICULTY_CONFIG[difficulty].label}
                </Text>
                <Text
                  style={[
                    styles.attemptsText,
                    selectedDifficulty === difficulty && styles.selectedText,
                  ]}
                >
                  {DIFFICULTY_CONFIG[difficulty].attempts} tries
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Word Length Selection */}
        <View style={[styles.section, settings.darkMode && styles.darkCard]}>
          <Text style={[styles.sectionTitle, settings.darkMode && styles.darkText]}>
            Word Length
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View style={styles.wordLengthRow}>
              {WORD_LENGTH_OPTIONS.map((length) => (
                <TouchableOpacity
                  key={length}
                  style={[
                    styles.wordLengthButton,
                    selectedWordLength === length && styles.selectedButton,
                  ]}
                  onPress={() => setSelectedWordLength(length)}
                >
                  <Text
                    style={[
                      styles.wordLengthText,
                      selectedWordLength === length && styles.selectedText,
                    ]}
                  >
                    {length}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* Start Game Button */}
        <TouchableOpacity style={styles.startButton} onPress={startGame}>
          <Text style={styles.startButtonText}>Start New Game</Text>
        </TouchableOpacity>

        {/* Navigation Buttons */}
        <View style={styles.navButtons}>
          <TouchableOpacity style={styles.navButton} onPress={navigateToStats}>
            <Text style={styles.navButtonText}>📊 Statistics</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.navButton} onPress={navigateToSettings}>
            <Text style={styles.navButtonText}>⚙️ Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
  content: {
    padding: 20,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1a1a1b',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#787c7e',
    marginBottom: 30,
  },
  darkText: {
    color: '#ffffff',
  },
  statsContainer: {
    backgroundColor: '#f6f7f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    width: '100%',
  },
  darkCard: {
    backgroundColor: '#2a2a2c',
  },
  statsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1b',
    marginBottom: 10,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  statLabel: {
    fontSize: 14,
    color: '#787c7e',
  },
  viewStatsButton: {
    alignSelf: 'center',
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#6aaa64',
    borderRadius: 6,
  },
  viewStatsText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#f6f7f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1b',
    marginBottom: 15,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  difficultyButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 12,
    marginHorizontal: 4,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#d3d6da',
  },
  selectedButton: {
    backgroundColor: '#6aaa64',
    borderColor: '#6aaa64',
  },
  difficultyText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1b',
  },
  attemptsText: {
    fontSize: 12,
    color: '#787c7e',
    marginTop: 2,
  },
  selectedText: {
    color: '#ffffff',
  },
  wordLengthRow: {
    flexDirection: 'row',
    paddingHorizontal: 5,
  },
  wordLengthButton: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginHorizontal: 4,
    borderWidth: 2,
    borderColor: '#d3d6da',
    minWidth: 50,
    alignItems: 'center',
  },
  wordLengthText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1b',
  },
  startButton: {
    backgroundColor: '#6aaa64',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 30,
    width: '100%',
    alignItems: 'center',
  },
  startButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  navButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  navButton: {
    backgroundColor: '#e6e6e6',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flex: 0.45,
    alignItems: 'center',
  },
  navButtonText: {
    fontSize: 16,
    color: '#1a1a1b',
    fontWeight: '500',
  },
});
