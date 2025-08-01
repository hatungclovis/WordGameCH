import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useGameStore } from '../services/gameStore';

type StatsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Stats'>;

interface Props {
  navigation: StatsScreenNavigationProp;
}

const { width: screenWidth } = Dimensions.get('window');

export default function StatsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { settings, statistics } = useGameStore();

  const headerHeight = Math.max(60, insets.top + 40);

  const StatCard = ({ title, value, subtitle }: { title: string; value: string | number; subtitle?: string }) => (
    <View style={[styles.statCard, settings.darkMode && styles.darkCard]}>
      <Text style={[styles.statValue, settings.darkMode && styles.darkText]}>
        {value}
      </Text>
      <Text style={[styles.statTitle, settings.darkMode && styles.darkText]}>
        {title}
      </Text>
      {subtitle && (
        <Text style={[styles.statSubtitle, settings.darkMode && styles.darkText]}>
          {subtitle}
        </Text>
      )}
    </View>
  );

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
            Statistics
          </Text>
          
          <View style={styles.spacer} />
        </View>
      </View>

      <ScrollView 
        contentContainerStyle={[
          styles.content,
          { paddingBottom: Math.max(insets.bottom, 20) }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {statistics.gamesPlayed === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, settings.darkMode && styles.darkText]}>
              No games played yet!
            </Text>
            <Text style={[styles.emptySubtext, settings.darkMode && styles.darkText]}>
              Start playing to see your statistics here.
            </Text>
            <TouchableOpacity 
              style={styles.playButton} 
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.playButtonText}>Play Your First Game</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            {/* Main Stats */}
            <View style={styles.statsGrid}>
              <StatCard 
                title="Games Played" 
                value={statistics.gamesPlayed} 
              />
              <StatCard 
                title="Win Rate" 
                value={`${statistics.winPercentage.toFixed(1)}%`} 
              />
              <StatCard 
                title="Current Streak" 
                value={statistics.currentStreak} 
              />
              <StatCard 
                title="Best Streak" 
                value={statistics.maxStreak} 
              />
            </View>

            {/* Score Stats */}
            <View style={[styles.section, settings.darkMode && styles.darkCard]}>
              <Text style={[styles.sectionTitle, settings.darkMode && styles.darkText]}>
                Scoring
              </Text>
              <View style={styles.scoreRow}>
                <Text style={[styles.scoreLabel, settings.darkMode && styles.darkText]}>
                  Total Score: {statistics.totalScore}
                </Text>
                <Text style={[styles.scoreLabel, settings.darkMode && styles.darkText]}>
                  Average: {statistics.averageScore.toFixed(1)}
                </Text>
              </View>
            </View>

            {/* Guess Distribution */}
            <View style={[styles.section, settings.darkMode && styles.darkCard]}>
              <Text style={[styles.sectionTitle, settings.darkMode && styles.darkText]}>
                Guess Distribution
              </Text>
              {Object.entries(statistics.guessDistribution).length === 0 ? (
                <Text style={[styles.noDataText, settings.darkMode && styles.darkText]}>
                  No completed games yet
                </Text>
              ) : (
                Object.entries(statistics.guessDistribution)
                  .sort(([a], [b]) => parseInt(a) - parseInt(b))
                  .map(([guesses, count]) => (
                    <View key={guesses} style={styles.distributionRow}>
                      <Text style={[styles.guessNumber, settings.darkMode && styles.darkText]}>
                        {guesses}
                      </Text>
                      <View style={styles.distributionBar}>
                        <View 
                          style={[
                            styles.distributionFill,
                            { 
                              width: `${(count / Math.max(...Object.values(statistics.guessDistribution))) * 100}%` 
                            }
                          ]} 
                        />
                        <Text style={styles.countText}>{count}</Text>
                      </View>
                    </View>
                  ))
              )}
            </View>

            {/* Actions */}
            <TouchableOpacity 
              style={styles.playAgainButton} 
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.playAgainText}>Play Another Game</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
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
    alignItems: 'baseline', // Changed from 'center' to 'baseline' for text alignment
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
    fontSize: 20,
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
    width: 60, // Same width as back button to center title
  },
  content: {
    padding: 20,
  },
  darkText: {
    color: '#ffffff',
  },
  emptyState: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1b',
    marginBottom: 10,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 16,
    color: '#787c7e',
    marginBottom: 30,
    textAlign: 'center',
  },
  playButton: {
    backgroundColor: '#6aaa64',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 50,
  },
  playButtonText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  statCard: {
    backgroundColor: '#f6f7f8',
    borderRadius: 12,
    padding: 15,
    width: '48%',
    alignItems: 'center',
    marginBottom: 15,
    minHeight: 80,
    justifyContent: 'center',
  },
  darkCard: {
    backgroundColor: '#2a2a2c',
  },
  statValue: {
    fontSize: Math.min(screenWidth * 0.08, 32),
    fontWeight: 'bold',
    color: '#6aaa64',
    marginBottom: 5,
  },
  statTitle: {
    fontSize: Math.min(screenWidth * 0.035, 14),
    color: '#787c7e',
    textAlign: 'center',
  },
  statSubtitle: {
    fontSize: 12,
    color: '#787c7e',
    marginTop: 2,
  },
  section: {
    backgroundColor: '#f6f7f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1b',
    marginBottom: 15,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  scoreLabel: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    color: '#1a1a1b',
    marginBottom: 5,
  },
  noDataText: {
    fontSize: 16,
    color: '#787c7e',
    textAlign: 'center',
    fontStyle: 'italic',
  },
  distributionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  guessNumber: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1b',
    width: 20,
  },
  distributionBar: {
    flex: 1,
    height: 20,
    backgroundColor: '#e5e5e5',
    borderRadius: 4,
    marginLeft: 10,
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
  distributionFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    height: '100%',
    backgroundColor: '#6aaa64',
    borderRadius: 4,
  },
  countText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1a1a1b',
  },
  playAgainButton: {
    backgroundColor: '#6aaa64',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 10,
    minHeight: 50,
  },
  playAgainText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});