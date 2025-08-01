import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useGameStore } from '../services/gameStore';

interface Props {
  error: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export default function ErrorScreen({ error, onRetry, showRetry = false }: Props) {
  const { settings } = useGameStore();

  const isWordFileError = error.includes('missing or corrupted') || 
                         error.includes('download the most updated version');

  return (
    <SafeAreaView style={[styles.container, settings.darkMode && styles.darkContainer]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>{isWordFileError ? '📦' : '⚠️'}</Text>
        </View>

        <Text style={[styles.title, settings.darkMode && styles.darkText]}>
          {isWordFileError ? 'Word Files Missing' : 'Something went wrong'}
        </Text>

        <Text style={[styles.message, settings.darkMode && styles.darkText]}>
          {isWordFileError ? 
            'The word database files are missing or corrupted. Please download the most updated version of the game from the app store to get the latest word files.' :
            error
          }
        </Text>

        {isWordFileError && (
          <View style={[styles.infoBox, settings.darkMode && styles.darkInfoBox]}>
            <Text style={[styles.infoTitle, settings.darkMode && styles.darkText]}>
              What happened?
            </Text>
            <Text style={[styles.infoText, settings.darkMode && styles.darkText]}>
              • Word database files could not be loaded{'\n'}
              • Files may be missing or corrupted{'\n'}
              • App installation may be incomplete
            </Text>
          </View>
        )}

        {isWordFileError && (
          <View style={[styles.solutionBox, settings.darkMode && styles.darkSolutionBox]}>
            <Text style={[styles.solutionTitle, settings.darkMode && styles.darkText]}>
              How to fix:
            </Text>
            <Text style={[styles.solutionText, settings.darkMode && styles.darkText]}>
              1. Update the app to the latest version{'\n'}
              2. If updating doesn't work, uninstall and reinstall the app{'\n'}
              3. Make sure you have enough storage space{'\n'}
              4. Check your internet connection during download
            </Text>
          </View>
        )}

        {showRetry && onRetry && (
          <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
            <Text style={styles.retryButtonText}>Try Again</Text>
          </TouchableOpacity>
        )}

        {isWordFileError && (
          <View style={styles.appInfoContainer}>
            <Text style={[styles.appInfoTitle, settings.darkMode && styles.darkText]}>
              Word Game CH
            </Text>
            <Text style={[styles.appInfoText, settings.darkMode && styles.darkText]}>
              Enhanced Wordle Experience
            </Text>
          </View>
        )}
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
    flex: 1,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  icon: {
    fontSize: 80,
    textAlign: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a1a1b',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    color: '#787c7e',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  darkText: {
    color: '#ffffff',
  },
  infoBox: {
    backgroundColor: '#f6f7f8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    width: '100%',
  },
  darkInfoBox: {
    backgroundColor: '#2a2a2c',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1b',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#787c7e',
    lineHeight: 20,
  },
  solutionBox: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 16,
    marginBottom: 30,
    width: '100%',
    borderWidth: 1,
    borderColor: '#6aaa64',
  },
  darkSolutionBox: {
    backgroundColor: '#1e2a1e',
    borderColor: '#4a7c59',
  },
  solutionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a1a1b',
    marginBottom: 8,
  },
  solutionText: {
    fontSize: 14,
    color: '#787c7e',
    lineHeight: 20,
  },
  retryButton: {
    backgroundColor: '#6aaa64',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 20,
  },
  retryButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
  appInfoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  appInfoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1a1a1b',
    marginBottom: 4,
  },
  appInfoText: {
    fontSize: 14,
    color: '#787c7e',
  },
});