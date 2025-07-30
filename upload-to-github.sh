#!/bin/bash

echo "🎮 Welcome to Word Game CH GitHub Upload Setup!"
echo "================================================"
echo ""

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: Not in the correct directory!"
    echo "Please run this script from: /Users/hatungclovis/Desktop/Programming/WordleGameRN"
    exit 1
fi

echo "📍 Current directory: $(pwd)"
echo ""

# Check if Git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed!"
    echo "Please install Git first:"
    echo "  1. Visit: https://git-scm.com/download/mac"
    echo "  2. Download and install Git"
    echo "  3. Restart terminal and run this script again"
    exit 1
fi

echo "✅ Git is installed: $(git --version)"
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "⚠️  Node.js is not installed!"
    echo "You'll need Node.js to run the app later."
    echo "Download from: https://nodejs.org"
    echo ""
    echo "Continuing with Git setup..."
else
    echo "✅ Node.js is installed: $(node --version)"
fi

echo ""
echo "🔧 Setting up Git repository..."
echo ""

# Initialize Git if not already initialized
if [ ! -d ".git" ]; then
    echo "📁 Initializing Git repository..."
    git init
else
    echo "📁 Git repository already exists"
fi

# Configure Git user if not set
git_email=$(git config --global user.email)
git_name=$(git config --global user.name)

if [ -z "$git_email" ]; then
    echo "📧 Setting up Git user email..."
    git config --global user.email "hatungclovis@gmail.com"
fi

if [ -z "$git_name" ]; then
    echo "👤 Setting up Git user name..."
    git config --global user.name "Clovis Hatungimana"
fi

echo "✅ Git user configured:"
echo "   Name: $(git config --global user.name)"
echo "   Email: $(git config --global user.email)"
echo ""

# Add all files
echo "📄 Adding all files to Git..."
git add .

# Check if there are changes to commit
if git diff --staged --quiet; then
    echo "ℹ️  No changes to commit"
else
    echo "💾 Creating initial commit..."
    git commit -m "Initial commit: Complete React Native Word Game CH implementation

🎮 Features:
- Three difficulty levels (Easy: 7, Medium: 5, Hard: 3 attempts)
- Variable word lengths (3-14 letters)
- Interactive game board with color-coded feedback
- On-screen keyboard with haptic feedback
- Hint system revealing unguessed letters
- Comprehensive statistics tracking
- Dark/Light mode toggle
- Complete game logic ported from Python implementation
- Cross-platform support (iOS, Android, Web)

🛠️ Tech Stack:
- React Native with Expo
- TypeScript
- Zustand for state management
- React Navigation
- AsyncStorage for persistence
- React Native Reanimated
- Expo Haptics

📚 Based on the original Python Wordle game by Clovis Hatungimana
🌟 Enhanced mobile version with professional UI/UX"
fi

echo ""

# Check if remote already exists
if git remote get-url origin &> /dev/null; then
    echo "🌐 GitHub remote already configured"
    current_remote=$(git remote get-url origin)
    echo "   Current remote: $current_remote"
    
    if [ "$current_remote" != "https://github.com/hatungclovis/WordGameCH.git" ]; then
        echo "🔄 Updating remote URL..."
        git remote set-url origin https://github.com/hatungclovis/WordGameCH.git
    fi
else
    echo "🌐 Adding GitHub remote..."
    git remote add origin https://github.com/hatungclovis/WordGameCH.git
fi

echo ""
echo "🌿 Setting up main branch..."
git branch -M main

echo ""
echo "📤 Pushing to GitHub..."
echo "This may ask for your GitHub credentials..."

if git push -u origin main; then
    echo ""
    echo "🎉 SUCCESS! Your Word Game CH is now on GitHub!"
    echo ""
    echo "🔗 Repository URL: https://github.com/hatungclovis/WordGameCH"
    echo ""
    echo "✨ What you can do now:"
    echo "  📱 Share your repository with others"
    echo "  💻 Clone it on other machines"
    echo "  🌐 View it online at GitHub"
    echo "  🤝 Accept contributions from other developers"
    echo "  📊 Track repository statistics"
    echo ""
    echo "🎮 To test your app:"
    echo "  1. Install Node.js if you haven't: https://nodejs.org"
    echo "  2. Run: npm install"
    echo "  3. Run: npm start"
    echo "  4. Use Expo Go app to scan QR code"
    echo ""
    echo "🏆 Congratulations! Your enhanced Word Game is live!"
else
    echo ""
    echo "❌ Upload failed. This might be because:"
    echo "  1. You need to authenticate with GitHub"
    echo "  2. The repository doesn't exist yet"
    echo "  3. You don't have push permissions"
    echo ""
    echo "💡 Solutions:"
    echo "  1. Make sure your GitHub repository exists: https://github.com/hatungclovis/WordGameCH"
    echo "  2. Try authenticating with GitHub CLI: gh auth login"
    echo "  3. Or use GitHub Desktop for easier authentication"
    echo ""
    echo "🔄 You can run this script again after fixing the issue"
fi
