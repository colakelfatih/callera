#!/bin/bash

# Deployment script for Callera
echo "🚀 Starting Callera deployment..."

# Check Node.js version
NODE_VERSION=$(node --version)
echo "📦 Node.js version: $NODE_VERSION"

# Check if Node.js version is 24.x
if [[ $NODE_VERSION == v24* ]]; then
    echo "✅ Node.js version is compatible"
else
    echo "❌ Node.js version must be 24.x, current: $NODE_VERSION"
    echo "Please update Node.js to version 24.x"
    exit 1
fi

# Install dependencies
echo "📥 Installing dependencies..."
npm ci

# Build the application
echo "🔨 Building application..."
npm run build

# Start the application
echo "🎯 Starting application..."
npm start
