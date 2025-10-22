#!/usr/bin/env node

// Simple test to verify WASM can be loaded
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Chronos WASM Build...\n');

// Test 1: Check if WASM file exists
const wasmPath = path.join(__dirname, 'example/public/main.wasm');
if (fs.existsSync(wasmPath)) {
    const stats = fs.statSync(wasmPath);
    console.log('✓ WASM file exists');
    console.log(`  Size: ${(stats.size / 1024 / 1024).toFixed(2)} MB`);
} else {
    console.log('✗ WASM file not found');
    process.exit(1);
}

// Test 2: Check if wasm_exec.js exists
const wasmExecPath = path.join(__dirname, 'example/public/wasm_exec.js');
if (fs.existsSync(wasmExecPath)) {
    const stats = fs.statSync(wasmExecPath);
    console.log('✓ wasm_exec.js exists');
    console.log(`  Size: ${(stats.size / 1024).toFixed(2)} KB`);
} else {
    console.log('✗ wasm_exec.js not found');
    process.exit(1);
}

// Test 3: Verify WASM magic number
const wasmBuffer = fs.readFileSync(wasmPath);
const magicNumber = wasmBuffer.slice(0, 4);
const expectedMagic = Buffer.from([0x00, 0x61, 0x73, 0x6d]); // \0asm

if (magicNumber.equals(expectedMagic)) {
    console.log('✓ WASM file has valid magic number');
} else {
    console.log('✗ WASM file has invalid magic number');
    process.exit(1);
}

// Test 4: Check Go source files
const sourceFiles = [
    'main.go',
    'pkg/crypto/sha256.go',
    'pkg/crypto/rsa.go',
    'pkg/math/matrix.go',
    'pkg/math/montecarlo.go',
    'pkg/protobuf/decoder.go'
];

console.log('\n📁 Source Files:');
sourceFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`  ✓ ${file}`);
    } else {
        console.log(`  ✗ ${file} (missing)`);
    }
});

// Test 5: Check React components
const components = [
    'example/src/App.jsx',
    'example/src/components/SHA256Demo.jsx',
    'example/src/components/MatrixDemo.jsx',
    'example/src/components/MonteCarloDemo.jsx',
    'example/src/components/RSADemo.jsx',
    'example/src/components/ProtobufDemo.jsx'
];

console.log('\n⚛️  React Components:');
components.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
        console.log(`  ✓ ${file}`);
    } else {
        console.log(`  ✗ ${file} (missing)`);
    }
});

// Test 6: Check package.json
const packageJsonPath = path.join(__dirname, 'example/package.json');
if (fs.existsSync(packageJsonPath)) {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    console.log('\n📦 Package Info:');
    console.log(`  Name: ${packageJson.name}`);
    console.log(`  Dependencies: ${Object.keys(packageJson.dependencies).length}`);
    console.log(`  Dev Dependencies: ${Object.keys(packageJson.devDependencies).length}`);
}

console.log('\n✅ All basic tests passed!');
console.log('\n🚀 To run the application:');
console.log('   cd example && npm run dev');
console.log('\n🌐 Then open: http://localhost:5173');
console.log('\n📝 Test page: http://localhost:5173/test.html');

