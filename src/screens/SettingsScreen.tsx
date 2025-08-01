import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Dimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useGameStore } from '../services/gameStore';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

const { width: screenWidth } = Dimensions.get('window');

export default function SettingsScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { settings, updateSettings, resetStatistics } = useGameStore();

  const headerHeight = Math.max(60, insets.top + 40);

  const toggleDarkMode = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  const toggleHaptic = () => {
    updateSettings({ hapticEnabled: !settings.hapticEnabled });
  };

  const toggleSound = () => {
    updateSettings({ soundEnabled: !settings.soundEnabled });
  };

  const handleResetStats = () => {
    // In a real app, you'd show a confirmation dialog
    resetStatistics();
  };

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
            Settings
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
        {/* Display Settings */}
        <View style={[styles.section, settings.darkMode && styles.darkCard]}>
          <Text style={[styles.sectionTitle, settings.darkMode && styles.darkText]}>
            Display
          </Text>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, settings.darkMode && styles.darkText]}>
              Dark Mode
            </Text>
            <Switch
              value={settings.darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: '#d3d6da', true: '#6aaa64' }}
              thumbColor={settings.darkMode ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Gameplay Settings */}
        <View style={[styles.section, settings.darkMode && styles.darkCard]}>
          <Text style={[styles.sectionTitle, settings.darkMode && styles.darkText]}>
            Gameplay
          </Text>
          
          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, settings.darkMode && styles.darkText]}>
              Haptic Feedback
            </Text>
            <Switch
              value={settings.hapticEnabled}
              onValueChange={toggleHaptic}
              trackColor={{ false: '#d3d6da', true: '#6aaa64' }}
              thumbColor={settings.hapticEnabled ? '#ffffff' : '#f4f3f4'}
            />
          </View>

          <View style={styles.settingRow}>
            <Text style={[styles.settingLabel, settings.darkMode && styles.darkText]}>
              Sound Effects
            </Text>
            <Switch
              value={settings.soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ false: '#d3d6da', true: '#6aaa64' }}
              thumbColor={settings.soundEnabled ? '#ffffff' : '#f4f3f4'}
            />
          </View>
        </View>

        {/* Data Management */}
        <View style={[styles.section, settings.darkMode && styles.darkCard]}>
          <Text style={[styles.sectionTitle, settings.darkMode && styles.darkText]}>
            Data
          </Text>
          
          <TouchableOpacity style={styles.resetButton} onPress={handleResetStats}>
            <Text style={styles.resetButtonText}>Reset All Statistics</Text>
          </TouchableOpacity>
        </View>

        {/* App Info */}
        <View style={[styles.section, settings.darkMode && styles.darkCard]}>
          <Text style={[styles.sectionTitle, settings.darkMode && styles.darkText]}>
            About
          </Text>
          <Text style={[styles.infoText, settings.darkMode && styles.darkText]}>
            Word Game CH
          </Text>
          <Text style={[styles.infoText, settings.darkMode && styles.darkText]}>
            Version 1.0.0
          </Text>
          <Text style={[styles.infoText, settings.darkMode && styles.darkText]}>
            Created by Clovis Hatungimana
          </Text>
        </View>
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
    width: 60, // Same width as back button to center title
  },
  content: {
    padding: 20,
  },
  darkText: {
    color: '#ffffff',
  },
  section: {
    backgroundColor: '#f6f7f8',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  darkCard: {
    backgroundColor: '#2a2a2c',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1a1a1b',
    marginBottom: 15,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    minHeight: 44, // Minimum touch target
  },
  settingLabel: {
    fontSize: Math.min(screenWidth * 0.04, 16),
    color: '#1a1a1b',
    flex: 1,
  },
  resetButton: {
    backgroundColor: '#dc3545',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
    minHeight: 44,
  },
  resetButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  infoText: {
    fontSize: 14,
    color: '#787c7e',
    marginBottom: 5,
    textAlign: 'center',
  },
});