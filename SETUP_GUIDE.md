# 📦 Setup Guide - Install Expo and Deploy to Google Play Store

## 🚀 **Option 1: Install Expo CLI (Recommended)**

### **Step 1: Install Expo CLI**
```bash
# Install Expo CLI globally
npm install -g @expo/cli

# Verify installation
expo --version
```

### **Step 2: Setup Your Project**
```bash
# Navigate to your project
cd "/Users/emci/Desktop/TestFramework/WordGameCH/Sans titre"

# Install project dependencies
npm install

# Test if everything works
npm start
```

## 🔄 **Option 2: Use npx (No Installation Needed)**

If you prefer not to install Expo globally, I've already configured your project to use `npx`:

### **All commands now work with npx:**
```bash
# Start development server
npm start

# Build for Play Store
npm run build:playstore

# Generate Android project
npm run prebuild
```

## 📱 **Prerequisites for Android Build**

### **You also need:**

1. **Java Development Kit (JDK)**
```bash
# Check if you have Java
java -version

# If not installed, install JDK 11 or 17
# On macOS with Homebrew:
brew install openjdk@17

# On Ubuntu/Debian:
sudo apt install openjdk-17-jdk

# On Windows: Download from Oracle or use Chocolatey:
choco install openjdk17
```

2. **Android Studio (for Android SDK)**
   - Download from: https://developer.android.com/studio
   - Install Android SDK
   - Set ANDROID_HOME environment variable

### **Quick Android Studio Setup:**
1. Download and install Android Studio
2. Open Android Studio → More Actions → SDK Manager
3. Install latest Android SDK
4. Add to your shell profile (~/.bash_profile, ~/.zshrc):
```bash
export ANDROID_HOME=$HOME/Library/Android/sdk
export PATH=$PATH:$ANDROID_HOME/emulator
export PATH=$PATH:$ANDROID_HOME/tools
export PATH=$PATH:$ANDROID_HOME/tools/bin
export PATH=$PATH:$ANDROID_HOME/platform-tools
```

## 🎯 **Complete Setup Process**

### **Step 1: Install Everything**
```bash
# 1. Install Expo CLI (choose one option)
npm install -g @expo/cli
# OR just use npx (no installation needed)

# 2. Install project dependencies
cd "/Users/emci/Desktop/TestFramework/WordGameCH/Sans titre"
npm install

# 3. Verify everything works
npm start
```

### **Step 2: Test Your App**
```bash
# Start development server
npm start

# This will show a QR code - scan with Expo Go app on your phone
# OR press 'a' to run on Android emulator
```

### **Step 3: Setup for Google Play Store**
```bash
# Make setup script executable
chmod +x setup-signing.sh

# Run interactive setup (creates keystore and configuration)
./setup-signing.sh
```

### **Step 4: Build for Play Store**
```bash
# Build AAB file for Google Play Store
npm run build:playstore
```

## 🛠️ **Troubleshooting**

### **Common Issues:**

1. **"expo: command not found"**
   ```bash
   # Solution: Use npx instead
   npx expo --version
   # OR install globally
   npm install -g @expo/cli
   ```

2. **"ANDROID_HOME not set"**
   ```bash
   # Add to ~/.zshrc or ~/.bash_profile
   export ANDROID_HOME=$HOME/Library/Android/sdk
   export PATH=$PATH:$ANDROID_HOME/platform-tools
   ```

3. **"Java not found"**
   ```bash
   # Install Java JDK
   brew install openjdk@17  # macOS
   # OR download from Oracle website
   ```

## 🚀 **Quick Start Commands**

### **If you want to install Expo globally:**
```bash
npm install -g @expo/cli
cd "/Users/emci/Desktop/TestFramework/WordGameCH/Sans titre"
npm install
npm start
```

### **If you prefer npx (no installation):**
```bash
cd "/Users/emci/Desktop/TestFramework/WordGameCH/Sans titre"
npm install
npm start  # This uses npx automatically
```

## 📋 **What Each Command Does:**

- `npm start` → Start development server (uses npx expo start)
- `npm run prebuild` → Generate Android/iOS native projects
- `npm run build:playstore` → Build AAB for Google Play Store
- `./setup-signing.sh` → Interactive setup for app signing

## ✅ **Ready to Proceed?**

Once you've installed the prerequisites:

1. **Test**: `npm start` (should show QR code)
2. **Setup**: `./setup-signing.sh` (creates signing keys)
3. **Build**: `npm run build:playstore` (creates AAB file)
4. **Deploy**: Upload AAB to Google Play Console

## 💡 **My Recommendation:**

**Use npx method** - I've already configured your project for it, so you don't need to install Expo globally. Just make sure you have Java and Android SDK installed.

```bash
# This will work immediately (uses npx):
cd "/Users/emci/Desktop/TestFramework/WordGameCH/Sans titre"
npm install
npm start
```

Choose whichever method you prefer! Both will work perfectly. 🎯
