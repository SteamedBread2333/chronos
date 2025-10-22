#!/bin/bash

echo "🚀 Chronos WASM - Quick Start"
echo "=============================="
echo ""

# Check if WASM is built
if [ ! -f "example/public/main.wasm" ]; then
    echo "📦 Building WASM..."
    make build
    if [ $? -ne 0 ]; then
        echo "❌ Build failed!"
        exit 1
    fi
    echo "✅ Build complete!"
    echo ""
fi

# Check if node_modules exists
if [ ! -d "example/node_modules" ]; then
    echo "📦 Installing dependencies..."
    cd example && npm install && cd ..
    echo "✅ Dependencies installed!"
    echo ""
fi

echo "🌐 Starting dev server..."
echo ""
echo "   Main App:  http://localhost:5173"
echo "   Test Page: http://localhost:5173/test.html"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

cd example && npm run dev

