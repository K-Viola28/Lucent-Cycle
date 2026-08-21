#!/bin/bash

# Script to serve Lucent Cycle locally
# Usage: ./serve.sh

# Check if Python 3 is available
if command -v python3 &> /dev/null; then
    echo "🌙 Starting Lucent Cycle server..."
    echo "📍 Open: http://localhost:8000"
    python3 -m http.server 8000
# Check if Node.js http-server is available
elif command -v http-server &> /dev/null; then
    echo "🌙 Starting Lucent Cycle server..."
    echo "📍 Open: http://localhost:8080"
    http-server
else
    echo "❌ Please install Python 3 or Node.js http-server"
    echo "   Python 3: Usually pre-installed"
    echo "   http-server: npm install -g http-server"
    exit 1
fi
