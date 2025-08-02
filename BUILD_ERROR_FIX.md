## 🚨 Build Error Fix: Java Version Compatibility

**Error**: `Unsupported class file major version 68`

**Cause**: This error occurs when Gradle tries to use Java class files compiled with Java 21 (version 68), but your build environment expects Java 17 or earlier.

## 🔧 **Quick Fix (Run these commands):**

```bash
# Make the fix script executable
chmod +x quick-fix-build.sh

# Run the quick fix
./quick-fix-build.sh
```

## 🛠 **Manual Fix Steps:**

### Step 1: Install Java 17 (if not already installed)
```bash
# Install Java 17 using Homebrew
brew install --cask zulu17

# Verify installation
/usr/libexec/java_home -V
```

### Step 2: Set JAVA_HOME to Java 17
```bash
# Set for current session
export JAVA_HOME=$(/usr/libexec/java_home -v 17)

# Verify
java -version
echo $JAVA_HOME
```

### Step 3: Make it permanent
Add this to your `~/.zshrc` or `~/.bash_profile`:
```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 17)
export PATH="$JAVA_HOME/bin:$PATH"
```

Then reload:
```bash
source ~/.zshrc
```

### Step 4: Clean and rebuild
```bash
cd android
./gradlew clean
./gradlew bundleRelease
```

## 🔍 **Why This Happens:**

- React Native 0.76+ requires Java 17
- Your system may have multiple Java versions
- Gradle picks up the wrong Java version
- Class file major version 68 = Java 21 (too new)
- Class file major version 61 = Java 17 (correct)

## ✅ **Verification Commands:**

```bash
# Check Java version
java -version

# Should show something like: "openjdk version "17.0.x"

# Check JAVA_HOME
echo $JAVA_HOME

# Should point to Java 17 installation

# Test Gradle with correct Java
cd android
./gradlew --version
```

## 🎯 **Expected Output After Fix:**

```
✅ Dependencies installed
✅ Clean completed  
✅ Build completed successfully!
🎉 Success! Your AAB file is ready:
📁 Location: android/app/build/outputs/bundle/release/app-release.aab
```

## 🆘 **If Still Having Issues:**

1. **Check all Java installations:**
   ```bash
   /usr/libexec/java_home -V
   ```

2. **Force Gradle to use specific Java:**
   ```bash
   cd android
   ./gradlew -Dorg.gradle.java.home=$(/usr/libexec/java_home -v 17) bundleRelease
   ```

3. **Clear all caches:**
   ```bash
   cd android
   ./gradlew clean
   rm -rf ~/.gradle/caches/
   ./gradlew bundleRelease
   ```

The `quick-fix-build.sh` script will handle most of these steps automatically!