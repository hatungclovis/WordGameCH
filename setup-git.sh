#!/bin/bash

echo "🚀 Setting up Git repository for Wordle Game React Native"
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
git commit -m "Initial commit: Complete React Native Wordle game implementation

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
- Expo Haptics"

echo ""
echo "✅ Git repository initialized successfully!"
echo ""
echo "🔗 Next steps:"
echo "1. Create your GitHub repository at: https://github.com/new"
echo "2. Copy the repository URL"
echo "3. Run the connect-to-github.sh script"
echo ""
echo "Repository name suggestion: wordle-game-react-native"
