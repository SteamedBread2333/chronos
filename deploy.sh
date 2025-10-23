#!/bin/bash

set -e

echo "🚀 Building Chronos WASM for GitHub Pages..."

# Build WASM
echo "📦 Building WASM module..."
GOOS=js GOARCH=wasm go build -o example/public/main.wasm

# Copy wasm_exec.js
echo "📋 Copying wasm_exec.js..."
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" example/public/

# Build React app
echo "⚛️  Building React app..."
cd example
npm install
npm run build

echo "✅ Build complete! Output in example/dist/"
echo ""
echo "📝 Next steps:"
echo "1. Push code to GitHub"
echo "2. Enable GitHub Pages in repository settings"
echo "3. Set source to 'GitHub Actions'"
echo "4. Your site will be at: https://YOUR_USERNAME.github.io/chronos-wasm/"

