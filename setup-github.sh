#!/bin/bash

echo "🚀 Setting up Git repository for Word Game CH"
echo ""

# Navigate to project directory
cd /Users/hatungclovis/Desktop/Programming/WordleGameRN

# Initialize Git repository
echo "📁 Initializing Git repository..."
git init

# Add all files
echo "📄 Adding all files..."
git add .

# Create initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Complete React Native Word Game CH implementation

Features:
- Three difficulty levels (Easy: 7, Medium: 5, Hard: 3 attempts)
- Variable word lengths (3-14 letters)
- Interactive game board with color-coded feedback
- On-screen keyboard with haptic feedback
- Hint system revealing unguessed letters
- Comprehensive statistics tracking
- Dark/Light mode toggle
- Complete game logic ported from Python implementation
- Cross-platform support (iOS, Android, Web)

Tech Stack:
- React Native with Expo
- TypeScript
- Zustand for state management
- React Navigation
- AsyncStorage for persistence
- React Native Reanimated
- Expo Haptics

Based on the original Python Wordle game by Clovis Hatungimana"

# Add GitHub remote
echo "🌐 Adding GitHub remote..."
git remote add origin https://github.com/hatungclovis/WordGameCH.git

# Set main branch
echo "🌿 Setting up main branch..."
git branch -M main

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push -u origin main

echo ""
echo "🎉 SUCCESS! Your Word Game CH is now on GitHub!"
echo ""
echo "📱 Repository URL: https://github.com/hatungclovis/WordGameCH"
echo ""
echo "🔗 You can now:"
echo "  • View your code online at https://github.com/hatungclovis/WordGameCH"
echo "  • Share the repository with others"
echo "  • Clone it on other machines"
echo "  • Set up GitHub Pages for web demo"
echo "  • Accept contributions from other developers"
echo ""
echo "📱 To test your app:"
echo "  1. Install Node.js if you haven't already"
echo "  2. Run: npm install"
echo "  3. Run: npm start"
echo "  4. Use Expo Go app to scan QR code"
