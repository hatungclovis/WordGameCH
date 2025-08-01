# STEP 2 DETAILED GUIDE - App Signing Configuration

## 🔐 Step 2: Configure App Signing (Manual Setup Required)

### **IMPORTANT: Do this AFTER Step 1 (generating the signing key)**

## 📋 **Complete Process:**

### **Step 2.1: Generate Android Project**
First, you need to create the Android project structure:

```bash
# Navigate to your project
cd "/Users/emci/Desktop/TestFramework/WordGameCH/Sans titre"

# Generate the Android project (this creates the 'android' folder)
expo prebuild
```

### **Step 2.2: Move Your Signing Key**
After generating the keystore in Step 1, move it to the right location:

```bash
# Move the keystore file to the android/app directory
mv wordgamech-upload-key.keystore android/app/
```

### **Step 2.3: Create/Edit gradle.properties**

**Option 1: If gradle.properties doesn't exist**
```bash
# Create the file
touch android/gradle.properties

# Open with any text editor (nano, vim, or VS Code)
nano android/gradle.properties
```

**Option 2: If gradle.properties already exists**
```bash
# Open existing file
nano android/gradle.properties
# or use VS Code:
code android/gradle.properties
```

### **Step 2.4: Add Signing Configuration**
Add these lines to `android/gradle.properties`:

```properties
# Signing configuration for Word Game CH
WORDGAMECH_UPLOAD_STORE_FILE=wordgamech-upload-key.keystore
WORDGAMECH_UPLOAD_KEY_ALIAS=wordgamech-key
WORDGAMECH_UPLOAD_STORE_PASSWORD=YOUR_ACTUAL_PASSWORD_HERE
WORDGAMECH_UPLOAD_KEY_PASSWORD=YOUR_ACTUAL_PASSWORD_HERE

# Android build settings
android.useAndroidX=true
android.enableJetifier=true
```

### **Step 2.5: Replace Password Placeholders**

**EXAMPLE:**
If your keystore password was `MyApp2024!Secure`, your file should look like:

```properties
# Signing configuration for Word Game CH
WORDGAMECH_UPLOAD_STORE_FILE=wordgamech-upload-key.keystore
WORDGAMECH_UPLOAD_KEY_ALIAS=wordgamech-key
WORDGAMECH_UPLOAD_STORE_PASSWORD=MyApp2024!Secure
WORDGAMECH_UPLOAD_KEY_PASSWORD=MyApp2024!Secure

# Android build settings
android.useAndroidX=true
android.enableJetifier=true
```

## 🔒 **Password Security Guidelines:**

### **What type of password to use:**
- **Minimum 8 characters**
- **Mix of letters, numbers, and symbols**
- **Examples of good passwords:**
  - `GameApp2024!`
  - `WordCH#2024`
  - `MySecure@App1`

### **Security Notes:**
- **Never share these passwords**
- **Store them in a password manager**
- **Back up the keystore file safely**
- **You'll need these for all future app updates**

## 🛠️ **Alternative: Create Configuration Automatically**

I can create a script to help you set this up. Here's a helper script:

```bash
#!/bin/bash
echo "🔐 Setting up app signing configuration..."

# Check if android folder exists
if [ ! -d "android" ]; then
    echo "📦 Generating Android project..."
    expo prebuild
fi

# Prompt for password
echo "Enter your keystore password (the one you created in Step 1):"
read -s password

# Create gradle.properties with configuration
cat > android/gradle.properties << EOF
# Signing configuration for Word Game CH
WORDGAMECH_UPLOAD_STORE_FILE=wordgamech-upload-key.keystore
WORDGAMECH_UPLOAD_KEY_ALIAS=wordgamech-key
WORDGAMECH_UPLOAD_STORE_PASSWORD=$password
WORDGAMECH_UPLOAD_KEY_PASSWORD=$password

# Android build settings
android.useAndroidX=true
android.enableJetifier=true
EOF

echo "✅ Configuration created successfully!"
```

## ❓ **Common Questions:**

**Q: Do I put my computer password?**
**A:** NO! Use the password you created specifically for the keystore in Step 1.

**Q: Are both passwords the same?**
**A:** YES! Usually the keystore password and key password are the same.

**Q: What if I forgot my keystore password?**
**A:** You'll need to generate a new keystore and start over. Keep it safe!

**Q: Is this secure?**
**A:** YES, but keep the `gradle.properties` file private. Never commit it to public repositories.

## 🚨 **CRITICAL REMINDERS:**

1. **Keep your keystore file safe** - You need it for ALL future updates
2. **Remember your password** - Can't recover app updates without it  
3. **Back up both files** - Store keystore and password safely
4. **Never share publicly** - Keep gradle.properties private

## ✅ **Verification:**
After completing Step 2, your file structure should look like:
```
your-project/
├── android/
│   ├── app/
│   │   └── wordgamech-upload-key.keystore
│   └── gradle.properties (with your passwords)
└── ...
```

**Ready to build!** 🚀
