# Word Game CH - Deployment Guide (Without EAS)

## 🚀 Deployment Options Without EAS

### Option 1: Local Builds with Expo CLI

#### Prerequisites
```bash
# Install Expo CLI globally
npm install -g @expo/cli

# For Android builds
# Install Android Studio and set up Android SDK
# Set ANDROID_HOME environment variable

# For iOS builds (macOS only)
# Install Xcode from App Store
# Install Xcode Command Line Tools: xcode-select --install
```

#### Building for Android (APK)
```bash
# 1. Generate native code
npm run prebuild

# 2. Build release APK
npm run build:android:local

# The APK will be generated in:
# android/app/build/outputs/apk/release/app-release.apk
```

#### Building for iOS (IPA)
```bash
# 1. Generate native code (macOS only)
npm run prebuild

# 2. Build release IPA
npm run build:ios:local

# The IPA will be generated in:
# ios/build/Build/Products/Release-iphoneos/
```

### Option 2: Classic React Native Build Process

#### Prerequisites
```bash
# Same as Option 1, plus:
npm install -g react-native-cli
```

#### Building Process
```bash
# 1. Generate native projects
expo prebuild

# 2. Navigate to project directory and install dependencies
cd android && ./gradlew clean && cd ..
cd ios && pod install && cd .. # (macOS only)

# 3. Build Android APK
cd android
./gradlew assembleRelease
cd ..

# 4. Build iOS (macOS only)
cd ios
xcodebuild -workspace WordGameCH.xcworkspace -scheme WordGameCH -configuration Release archive
cd ..
```

### Option 3: Expo Web Build

#### Building for Web
```bash
# Install web dependencies
npm install react-dom react-native-web

# Start web development server
npm run web

# Build for production
expo export:web

# The web build will be in the 'web-build' folder
# Deploy this folder to any static hosting service
```

## 📱 Distribution Options

### Android Distribution
1. **Google Play Store**
   - Upload the APK/AAB to Google Play Console
   - Follow Google's app review process

2. **Direct APK Distribution**
   - Share the APK file directly
   - Users need to enable "Install from Unknown Sources"

3. **Alternative App Stores**
   - Amazon Appstore
   - Samsung Galaxy Store
   - F-Droid (for open-source apps)

### iOS Distribution
1. **Apple App Store**
   - Upload IPA to App Store Connect
   - Follow Apple's app review process

2. **TestFlight** (Beta Testing)
   - Upload to App Store Connect
   - Invite beta testers

3. **Enterprise Distribution** (Requires Enterprise Account)
   - Direct distribution within organization

### Web Distribution
1. **Static Hosting Services**
   - Netlify: `netlify deploy --dir=web-build`
   - Vercel: `vercel --prod web-build`
   - GitHub Pages
   - Firebase Hosting

2. **Traditional Web Hosting**
   - Upload web-build folder to any web server

## 🔧 Build Configuration

### App Signing (Important for Production)

#### Android App Signing
1. Generate signing key:
```bash
keytool -genkeypair -v -storetype PKCS12 -keystore my-upload-key.keystore -alias my-key-alias -keyalg RSA -keysize 2048 -validity 10000
```

2. Add to `android/gradle.properties`:
```
MYAPP_UPLOAD_STORE_FILE=my-upload-key.keystore
MYAPP_UPLOAD_KEY_ALIAS=my-key-alias
MYAPP_UPLOAD_STORE_PASSWORD=*****
MYAPP_UPLOAD_KEY_PASSWORD=*****
```

3. Update `android/app/build.gradle`:
```gradle
android {
    ...
    signingConfigs {
        release {
            if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
                storeFile file(MYAPP_UPLOAD_STORE_FILE)
                storePassword MYAPP_UPLOAD_STORE_PASSWORD
                keyAlias MYAPP_UPLOAD_KEY_ALIAS
                keyPassword MYAPP_UPLOAD_KEY_PASSWORD
            }
        }
    }
    buildTypes {
        release {
            ...
            signingConfig signingConfigs.release
        }
    }
}
```

#### iOS App Signing
- Handled automatically through Xcode
- Requires Apple Developer Account
- Set up provisioning profiles in Xcode

## 🏗️ Pre-Build Checklist

### 1. Update App Version
Update version in `app.json`:
```json
{
  "expo": {
    "version": "1.0.0",
    "ios": {
      "buildNumber": "1"
    },
    "android": {
      "versionCode": 1
    }
  }
}
```

### 2. App Icons and Splash Screen
- Ensure all required icon sizes are present in `assets/icons/`
- Test splash screen on different devices

### 3. Permissions
Verify required permissions in `app.json`:
```json
{
  "expo": {
    "android": {
      "permissions": [
        "VIBRATE"
      ]
    }
  }
}
```

### 4. Test Production Build
```bash
# Test release build locally before distribution
expo start --no-dev --minify
```

## 🚢 Quick Deploy Commands

### Android Release
```bash
# Complete Android build process
npm run prebuild:clean
npm run build:android:local
```

### iOS Release (macOS only)
```bash
# Complete iOS build process
npm run prebuild:clean
npm run build:ios:local
```

### Web Release
```bash
# Build and deploy to Netlify
expo export:web
netlify deploy --prod --dir=web-build
```

## 📋 Troubleshooting

### Common Issues
1. **Metro bundler issues**: Clear cache with `expo start --clear`
2. **Android build fails**: Check Android SDK path and Java version
3. **iOS build fails**: Update Xcode and check provisioning profiles
4. **Dependency conflicts**: Try `npm run prebuild:clean`

### Performance Optimization
1. **Enable Hermes** (Android): Set `"hermes": true` in app.json
2. **Optimize bundle size**: Use `expo-doctor` to check for issues
3. **Image optimization**: Compress images in assets folder

Your app is now ready for deployment without using EAS! 🎉
