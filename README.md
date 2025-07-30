# Word Game CH - React Native

A comprehensive React Native implementation of an enhanced Wordle-style word game, based on the original Python version by Clovis Hatungimana.

![Word Game CH](https://img.shields.io/badge/Platform-iOS%20%7C%20Android%20%7C%20Web-blue)
![React Native](https://img.shields.io/badge/React%20Native-Expo-green)
![TypeScript](https://img.shields.io/badge/TypeScript-Ready-blue)

## 🎮 Features

- **Multiple Difficulty Levels**: Easy (7 tries), Medium (5 tries), Hard (3 tries)
- **Variable Word Lengths**: 3-14 letters
- **Intelligent Hint System**: Reveal letters when stuck
- **Comprehensive Statistics**: Win rates, streaks, score tracking
- **Dark/Light Mode**: Customizable themes
- **Haptic Feedback**: Enhanced mobile experience
- **Offline Play**: All words stored locally
- **Cross-Platform**: iOS, Android, and Web support

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Expo CLI (`npm install -g @expo/cli`)
- For iOS: Xcode (Mac only)
- For Android: Android Studio

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/hatungclovis/WordGameCH.git
   cd WordGameCH
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on device/simulator**
   - For iOS: Press `i` in the terminal or scan QR code with Camera app
   - For Android: Press `a` in the terminal or scan QR code with Expo Go
   - For Web: Press `w` in the terminal

### 📱 Mobile Testing

**Install Expo Go:**
- [iOS App Store](https://apps.apple.com/app/expo-go/id982107779)
- [Google Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)

## 🎯 Game Rules

1. **Choose your challenge**: Select difficulty level and word length
2. **Make your guesses**: Use the on-screen keyboard to enter words
3. **Get feedback**: 
   - 🟢 Green: Correct letter in correct position
   - 🟡 Yellow: Correct letter in wrong position  
   - ⚫ Gray: Letter not in the word
4. **Use hints wisely**: Reveal letters when you're stuck
5. **Track your progress**: View detailed statistics and streaks

## 🏗️ Architecture

### Tech Stack
- **Framework**: React Native with Expo
- **Language**: TypeScript
- **State Management**: Zustand with AsyncStorage persistence
- **Navigation**: React Navigation 6
- **Animations**: React Native Reanimated 3
- **Haptics**: Expo Haptics

### Project Structure
```
src/
├── components/
│   ├── game/               # Game-specific components
│   │   ├── GameBoard.tsx   # Interactive game grid
│   │   ├── Tile.tsx        # Individual letter tiles
│   │   └── Keyboard.tsx    # On-screen keyboard
│   └── common/             # Reusable components
├── screens/
│   ├── HomeScreen.tsx      # Main menu and setup
│   ├── GameScreen.tsx      # Game interface
│   ├── StatsScreen.tsx     # Statistics display
│   └── SettingsScreen.tsx  # App preferences
├── services/
│   ├── gameStore.ts        # Zustand state management
│   ├── WordService.ts      # Word database management
│   └── GameEngine.ts       # Core game logic
├── types/                  # TypeScript definitions
├── utils/                  # Helper functions
└── navigation/             # App navigation
```

## 🎨 Screenshots

*Screenshots will be added here*

## 🔄 From Python to React Native

This React Native version preserves all the core features from the original Python implementation:

| Python Feature | React Native Implementation |
|----------------|----------------------------|
| `ScrapeCommonWords` & `ScrapeAllWords` classes | `WordService.ts` with JSON word databases |
| `WordMatching` class | `GameEngine.ts` with identical logic |
| `UserInput` class | Interactive on-screen keyboard |
| Difficulty levels & scoring | Exact same system preserved |
| Hint system | Enhanced with better UX |
| Statistics analysis | Comprehensive mobile dashboard |

### Enhanced Mobile Features
- **Touch-optimized interface** designed for mobile interaction
- **Haptic feedback** for better game feel
- **Responsive design** that adapts to different screen sizes
- **Dark mode** for comfortable night play
- **Offline capability** - no internet required
- **State persistence** - resume games after closing app

## 📊 Game Statistics

Track your progress with comprehensive statistics:
- Games played and win percentage
- Current and best streaks
- Score tracking and averages
- Guess distribution analysis
- Performance by difficulty level

## ⚙️ Settings

- **Theme**: Toggle between light and dark modes
- **Haptics**: Enable/disable vibration feedback
- **Sound**: Prepare for audio feedback (coming soon)
- **Data**: Reset statistics when needed

## 🚧 Development Status

- ✅ **Core Game Logic**: Complete and tested
- ✅ **User Interface**: Fully functional
- ✅ **Statistics System**: Comprehensive tracking
- ✅ **Settings**: Theme and preferences
- ✅ **Mobile Optimization**: Touch and haptic feedback
- 🔄 **Polish**: Animations and enhanced UX (in progress)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Contact

**Clovis Hatungimana**
- Email: hatungclovis@gmail.com
- GitHub: [@hatungclovis](https://github.com/hatungclovis)

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

**Built with ❤️ by Clovis Hatungimana**

*Enhanced mobile version of the original Python Wordle game - 2025*
