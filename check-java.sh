#!/bin/bash

echo "🔍 Checking Java installations..."

# Check current Java version
echo "Current JAVA_HOME: $JAVA_HOME"
echo "Current Java version:"
java -version

echo ""
echo "Available Java installations:"
/usr/libexec/java_home -V

echo ""
echo "🔧 Setting up Java 17 for the project..."

# Try to find Java 17
JAVA17_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null)

if [ -n "$JAVA17_HOME" ]; then
    echo "✅ Found Java 17 at: $JAVA17_HOME"
    export JAVA_HOME=$JAVA17_HOME
    echo "Updated JAVA_HOME to: $JAVA_HOME"
    java -version
else
    echo "❌ Java 17 not found. Available versions:"
    /usr/libexec/java_home -V
    echo ""
    echo "Please install Java 17 using:"
    echo "brew install openjdk@17"
    echo "Or download from: https://adoptium.net/temurin/releases/"
fi