#!/bin/bash

# Build Go WASM
echo "Building Go WASM..."
GOOS=js GOARCH=wasm go build -o example/public/main.wasm main.go

# Copy wasm_exec.js
echo "Copying wasm_exec.js..."
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" example/public/

echo "Build complete!"

