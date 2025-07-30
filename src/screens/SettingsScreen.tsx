import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Switch,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useGameStore } from '../services/gameStore';

type SettingsScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Settings'>;

interface Props {
  navigation: SettingsScreenNavigationProp;
}

export default function SettingsScreen({ navigation }: Props) {
  const { settings, updateSettings, resetStatistics } = useGameStore();

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
    <SafeAreaView style={[styles.container, settings.darkMode && styles.darkContainer]}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.title, settings.darkMode && styles.darkText]}>
          Settings
        </Text>

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
            Word Game CH - Enhanced Version
          </Text>
          <Text style={[styles.infoText, settings.darkMode && styles.darkText]}>
            Version 1.0.0
          </Text>
          <Text style={[styles.infoText, settings.darkMode && styles.darkText]}>
            Created by Clovis Hatungimana
          </Text>
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
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1a1a1b',
    marginBottom: 30,
    textAlign: 'center',
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
  },
  settingLabel: {
    fontSize: 16,
    color: '#1a1a1b',
  },
  resetButton: {
    backgroundColor: '#dc3545',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    alignItems: 'center',
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
