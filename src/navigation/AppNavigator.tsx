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
          headerShown: false, // This removes all headers
        }}
      >
        <Stack.Screen
          name="Home"
          component={HomeScreen}
        />
        <Stack.Screen
          name="Game"
          component={GameScreen}
        />
        <Stack.Screen
          name="Settings"
          component={SettingsScreen}
        />
        <Stack.Screen
          name="Stats"
          component={StatsScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}