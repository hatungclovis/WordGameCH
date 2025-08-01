# Word Game CH - Google Play Store Deployment Guide

## 🏪 Google Play Store Deployment

### Prerequisites
1. **Google Play Console Account** ($25 one-time registration fee)
2. **Android Studio** installed with Android SDK
3. **Java Development Kit (JDK)** 8 or higher

## 📋 Pre-Deployment Checklist

### 1. App Information (Already Configured)
- **App Name**: Word Game CH ✅
- **Package Name**: com.hatungclovis.wordgamech ✅
- **Version**: 1.0.0 ✅
- **Version Code**: 1 ✅

### 2. Required Assets

#### App Icons (Already in your project ✅)
- Your adaptive icon is already configured
- Located in `assets/icons/adaptive-icon.svg`

#### Screenshots Needed (You need to create these 📸)
Take screenshots of your app running on different screens:
- **Phone screenshots**: 2-8 images, 16:9 or 9:16 ratio
  - Home screen
  - Game selection screen
  - Active gameplay screen
  - Statistics screen
  - Word analysis screen
  - Settings screen

#### Store Listing Graphics (You need to create these 🎨)
- **Feature Graphic**: 1024x500px (required for Play Store)
- **Promo Video**: YouTube URL (optional but recommended)

## 🔨 Building for Google Play Store

### Step 1: Generate App Signing Key
```bash
# Navigate to your project directory
cd "/Users/emci/Desktop/TestFramework/WordGameCH/Sans titre"

# Generate signing key (KEEP THIS SAFE!)
keytool -genkeypair -v -storetype PKCS12 -keystore wordgamech-upload-key.keystore -alias wordgamech-key -keyalg RSA -keysize 2048 -validity 10000
```

**📝 During key generation, you'll be asked:**
- Enter keystore password: (create a strong password)
- Re-enter password: (confirm it)
- What is your first and last name? (Your name)
- What is your organizational unit? (Your company/personal)
- What is your organization? (Your company name)
- What is your City/Locality? (Your city)
- What is your State/Province? (Your state)
- What is your country code? (Your country code, e.g., US, CA, etc.)

**⚠️ IMPORTANT**: 
- Store the keystore file and passwords safely
- You'll need them for ALL future app updates
- If you lose this, you can't update your app on Play Store

### Step 2: Configure Gradle for Signing

1. **Create signing configuration file**:
Create `android/gradle.properties` (or add to existing):
```properties
# Add these lines to android/gradle.properties
WORDGAMECH_UPLOAD_STORE_FILE=wordgamech-upload-key.keystore
WORDGAMECH_UPLOAD_KEY_ALIAS=wordgamech-key
WORDGAMECH_UPLOAD_STORE_PASSWORD=YOUR_KEYSTORE_PASSWORD
WORDGAMECH_UPLOAD_KEY_PASSWORD=YOUR_KEY_PASSWORD

# Replace YOUR_KEYSTORE_PASSWORD and YOUR_KEY_PASSWORD with actual passwords
```

2. **Move keystore file**:
```bash
# Move the keystore to android/app directory
mv wordgamech-upload-key.keystore android/app/
```

### Step 3: Update Build Configuration

The build configuration will be automatically created when you run `expo prebuild`. 

### Step 4: Build AAB (Android App Bundle) for Play Store
```bash
# Build optimized bundle for Play Store
npm run build:playstore
```

This will generate: `android/app/build/outputs/bundle/release/app-release.aab`

## 📱 Google Play Console Setup

### Step 1: Create App in Play Console
1. Go to [Google Play Console](https://play.google.com/console)
2. Click "Create app"
3. Fill in details:
   - **App name**: Word Game CH
   - **Default language**: English (United States)
   - **App or game**: Game
   - **Free or paid**: Free

### Step 2: Complete App Information

#### Store Listing
- **App name**: Word Game CH
- **Short description** (80 chars):
  ```
  Enhanced Wordle-style word game with multiple difficulties and word lengths
  ```
- **Full description** (4000 chars):
  ```
  Word Game CH is an enhanced Wordle-style word guessing game that takes the classic formula to the next level!

  🎯 GAME FEATURES:
  • Three difficulty levels: Easy (7 tries), Medium (5 tries), Hard (3 tries)
  • Customizable word lengths from 3 to 14 letters
  • Smart hint system to help you learn
  • Comprehensive statistics tracking
  • Word analysis and frequency insights
  • Dark mode support
  • Haptic feedback

  📊 LEARN WHILE YOU PLAY:
  • Interactive word analysis showing letter frequency
  • Discover new words by length or starting letter
  • Strategic insights to improve your gameplay
  • Vocabulary expansion through word exploration

  🎮 ENHANCED GAMEPLAY:
  • Color-coded feedback system (green/yellow/gray)
  • Intelligent scoring based on performance
  • Streak tracking and achievements
  • Offline play - no internet required

  Perfect for word game enthusiasts, students, and anyone looking to expand their vocabulary while having fun!

  Download now and challenge yourself with the ultimate word guessing experience!
  ```

#### Graphics
- **App icon**: 512x512px (will be auto-generated from your adaptive icon)
- **Feature graphic**: 1024x500px (create one featuring your app)
- **Screenshots**: Add 2-8 screenshots of your app

#### Categorization
- **App category**: Word
- **Tags**: word game, puzzle, vocabulary, educational, brain training

### Step 3: Content Rating
1. Complete the questionnaire (select appropriate ratings)
2. For a word game like yours, it should be suitable for all ages

### Step 4: Target Audience
- **Target age**: All ages
- **Appeals to children**: No (unless specifically designed for kids)

### Step 5: Upload App Bundle
1. Go to "Release" > "Production"
2. Click "Create new release"
3. Upload your AAB file: `android/app/build/outputs/bundle/release/app-release.aab`
4. Add release notes:
   ```
   Initial release of Word Game CH!
   
   Features:
   • Multiple difficulty levels
   • Customizable word lengths
   • Smart hints system
   • Word analysis and insights
   • Dark mode support
   • Comprehensive statistics
   ```

## 🚀 Publishing Process

### Step 1: Review and Publish
1. Complete all required sections in Play Console
2. Click "Review release"
3. Fix any issues highlighted by Google
4. Click "Start rollout to production"

### Step 2: Review Timeline
- **Review time**: Usually 1-3 days
- **First app**: May take up to 7 days
- **You'll receive email notifications** about review status

## 📈 Post-Launch

### Analytics Setup
- Enable Play Console analytics
- Monitor downloads, ratings, and user feedback
- Track crashes and ANRs (Application Not Responding)

### Updates
For future updates:
```bash
# 1. Update version in app.json
# 2. Build new AAB
npm run build:playstore
# 3. Upload to Play Console
```

## 🛠️ Build Commands Summary

```bash
# Development
npm start                    # Start Expo dev server
npm run android             # Run on Android emulator/device

# Production Build
npm run build:playstore     # Build AAB for Play Store
npm run prebuild           # Generate native Android project
npm run prebuild:clean     # Clean and regenerate native project
```

## 📋 Pre-Launch Testing

### Internal Testing
1. Upload AAB to "Internal testing" track first
2. Add yourself as tester
3. Download and test thoroughly
4. Fix any issues before production release

### Testing Checklist
- [ ] App launches correctly
- [ ] All game features work
- [ ] Statistics save/load properly
- [ ] Dark mode toggles correctly
- [ ] Haptic feedback works
- [ ] Word analysis displays correctly
- [ ] No crashes during gameplay

## 🆘 Troubleshooting

### Common Issues
1. **Build fails**: Check Android SDK path and Java version
2. **Signing issues**: Verify keystore path and passwords
3. **Upload rejected**: Check for policy violations in description
4. **Missing permissions**: Ensure all required permissions are declared

### Support Resources
- [Google Play Console Help](https://support.google.com/googleplay/android-developer)
- [Android Developer Documentation](https://developer.android.com)
- [Expo Documentation](https://docs.expo.dev)

## 🎉 Ready to Publish!

Your Word Game CH is now configured and ready for Google Play Store deployment. Follow this guide step by step, and you'll have your app live on the Play Store soon!

**Good luck with your launch! 🚀**
