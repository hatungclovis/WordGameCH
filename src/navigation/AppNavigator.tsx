import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';

// Import screens (we'll create these next)
import HomeScreen from '../screens/HomeScreen';
import GameScreen from '../screens/GameScreen';
import SettingsScreen from '../screens/SettingsScreen';
import StatsScreen from '../screens/StatsScreen';
import { useGameStore } from '../services/gameStore';

export type RootStackParamList = {
  Home: undefined;
  Game: {
    difficulty: 'easy' | 'medium' | 'hard';
    wordLength: number;
  };
  Settings: undefined;
  Stats: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  const { settings } = useGameStore();

  return (
    <NavigationContainer>
      <StatusBar style={settings.darkMode ? 'light' : 'dark'} />
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: settings.darkMode ? '#1a1a1b' : '#ffffff',
          },
          headerTintColor: settings.darkMode ? '#ffffff' : '#1a1a1b',
          headerTitleStyle: {
            fontWeight: 'bold',
            fontSize: 18,
          },
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{
            title: 'Word Game CH',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
          options={{
            title: 'Playing',
            headerTitleAlign: 'center',
            headerBackTitleVisible: false,
          }}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: 'Settings',
            headerTitleAlign: 'center',
          }}
        />
        <Stack.Screen
          name="Stats"
          component={StatsScreen}
          options={{
            title: 'Statistics',
            headerTitleAlign: 'center',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
