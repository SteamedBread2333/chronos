<div align="center">
  <img src="logo.svg" alt="Chronos WASM Logo" width="150" height="150">
  
  # Chronos WASM
  
  **High-Performance Go WebAssembly Demonstrations**
  
  [![Go Version](https://img.shields.io/badge/Go-1.21+-00ADD8?style=flat&logo=go)](https://go.dev/)
  [![WebAssembly](https://img.shields.io/badge/WebAssembly-654FF0?style=flat&logo=webassembly&logoColor=white)](https://webassembly.org/)
  [![React](https://img.shields.io/badge/React-18.2-61DAFB?style=flat&logo=react)](https://react.dev/)
  [![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?style=flat&logo=vite)](https://vitejs.dev/)
  
  *Cryptography • Mathematics • Data Processing*
</div>

---

## 📋 Table of Contents

- [Features](#-features)
- [Live Demo](#-live-demo)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [API Usage](#-api-usage)
- [Performance](#-performance)
- [Building](#-building)
- [Development](#-development)
- [Browser Support](#-browser-support)
- [License](#-license)

## ✨ Features

Chronos WASM showcases five powerful capabilities implemented in Go and compiled to WebAssembly:

### 🔐 **SHA-256 Hash**
- Fast cryptographic hashing using Go's standard library
- Hexadecimal output format
- Performance: < 1ms for small texts

### 🔢 **Matrix Multiplication**
- Efficient N×N matrix operations
- Optimized for 100×100 matrices and larger
- Real-time performance monitoring
- Performance: 10-50ms for 100×100 matrices

### 🎲 **Monte Carlo Simulation Framework**
- **Estimate π**: Circle method with error analysis
- **Definite Integral**: Numerical integration (∫x² dx)
- **Dice Rolling**: Multi-dice probability distribution
- **Random Walk**: 2D random walk simulation
- Configurable iteration count (default: 1 million)
- Performance: 50-100ms for 1M iterations

### 🔑 **RSA Digital Signature**
- RSA-1024 signing and verification
- Big integer support
- PKCS#1 v1.5 with SHA-256
- Base64-encoded signatures
- Performance: 5-20ms depending on key size

### 📦 **Base64 → Protobuf Decoder**
- Decode base64-encoded Protocol Buffer messages
- Support for Any-type messages
- Automatic type detection
- Hexadecimal output for debugging

## 🚀 Live Demo

Once the development server is running, access:

- **Main Application**: http://localhost:5173
- **Test Suite**: http://localhost:5173/test.html

## 🎯 Quick Start

### Prerequisites

- **Go** 1.21 or higher
- **Node.js** 18 or higher
- **npm** or **yarn**

### Installation & Running

#### Option 1: Quick Start Script (Recommended)

```bash
./run.sh
```

This script automatically:
1. Builds WASM if needed
2. Installs npm dependencies if needed
3. Starts the development server

#### Option 2: Using Makefile

```bash
# Install all dependencies
make install

# Build WASM and start dev server
make dev
```

#### Option 3: Manual Steps

```bash
# 1. Install Go dependencies
go mod download

# 2. Build WASM
GOOS=js GOARCH=wasm go build -o example/public/main.wasm main.go

# 3. Copy wasm_exec.js
cp "$(go env GOROOT)/misc/wasm/wasm_exec.js" example/public/

# 4. Install frontend dependencies
cd example
npm install

# 5. Start development server
npm run dev
```

## 📁 Project Structure

```
chronos-wasm/
├── main.go                    # WASM entry point
├── go.mod                     # Go module definition
├── Makefile                   # Build automation
├── build.sh                   # Build script
├── run.sh                     # Quick start script
├── logo.svg                   # Project logo
│
├── pkg/                       # Go packages (following best practices)
│   ├── crypto/               # Cryptography functions
│   │   ├── sha256.go         # SHA-256 implementation
│   │   └── rsa.go            # RSA signature/verification
│   ├── math/                 # Mathematical computations
│   │   ├── matrix.go         # Matrix multiplication
│   │   └── montecarlo.go     # Monte Carlo simulation
│   └── protobuf/             # Protobuf processing
│       └── decoder.go        # Base64 to Protobuf decoder
│
└── example/                   # Vite + React demo application
    ├── package.json          # npm dependencies
    ├── vite.config.js        # Vite configuration (WASM headers)
    ├── index.html            # HTML entry point
    │
    ├── public/               # Static assets
    │   ├── main.wasm         # Compiled WASM binary
    │   ├── wasm_exec.js      # Go WASM runtime
    │   └── test.html         # Standalone test page
    │
    └── src/                  # React source code
        ├── main.jsx          # React entry
        ├── App.jsx           # Main application component
        ├── index.css         # Global styles
        │
        └── components/       # React components
            ├── SHA256Demo.jsx
            ├── MatrixDemo.jsx
            ├── MonteCarloDemo.jsx
            ├── RSADemo.jsx
            └── ProtobufDemo.jsx
```

## 💻 API Usage

All functions are registered on the global `window` object and can be called directly from JavaScript.

### SHA-256 Hash

```javascript
const result = window.sha256Hash("Hello, World!")
console.log(result.hash)
// Output: "dffd6021bb2bd5b0af676290809ec3a53191dd81c7f70a4b28688a362182986f"
```

### Matrix Multiplication

```javascript
const matrixA = [[1, 2], [3, 4]]
const matrixB = [[5, 6], [7, 8]]
const result = window.matrixMultiply(matrixA, matrixB)
console.log(result.result)
// Output: [[19, 22], [43, 50]]
```

### Monte Carlo Simulation

The Monte Carlo function now supports multiple simulation types:

#### Estimate π

```javascript
const result = window.monteCarlo('pi', 1000000)
console.log(result.result)      // ~3.14159...
console.log(result.actual)      // 3.141592653589793
console.log(result.error)       // Error percentage
console.log(result.inside)      // Points inside circle
console.log(result.convergence) // Convergence rate
```

#### Definite Integral (∫x² dx from 0 to 1)

```javascript
const result = window.monteCarlo('integral', 1000000)
console.log(result.result)   // ~0.333...
console.log(result.actual)   // 0.333... (1/3)
console.log(result.error)    // Error percentage
console.log(result.function) // "x²"
console.log(result.interval) // "[0, 1]"
```

#### Dice Rolling Simulation

```javascript
// Roll 2 dice, 100,000 times
const result = window.monteCarlo('dice', 100000, 2)
console.log(result.average)      // ~7.0 (expected for 2 dice)
console.log(result.expected)     // 7.0
console.log(result.distribution) // Probability distribution
console.log(result.numDice)      // 2
```

#### 2D Random Walk

```javascript
const result = window.monteCarlo('random_walk', 10000)
console.log(result.finalX)           // Final X position
console.log(result.finalY)           // Final Y position
console.log(result.finalDistance)    // Distance from origin
console.log(result.expectedDistance) // √n (theoretical)
console.log(result.maxDistance)      // Maximum distance reached
```

### RSA Digital Signature

```javascript
// Private key for signing
const privateKey = {
  n: "119648321071599662636280525066239031513861172559545055237682545016849345248559002382212779806215669109844712160945279475028257045415011034146247010695764706749385196480966692000781820901770244415003256367588582441320021736783850733931684870645399781008639796575584441496351969572678678664660965545996833321987",
  d: "33125699401614966792864976838493890585520454788999576647697193006366219766887083917848845433783667365970022732262258318730643910470919750813534017205079608840790411756744869210517388636296957049962084433345999349681275453821727256230382271421438176394286504384252162645222388934042274670324525236035765556493",
  e: 65537
}

// Sign message
const signResult = window.rsaSign("Hello, RSA!", JSON.stringify(privateKey))
console.log(signResult.signature) // Base64-encoded signature

// Public key for verification
const publicKey = {
  n: "119648321071599662636280525066239031513861172559545055237682545016849345248559002382212779806215669109844712160945279475028257045415011034146247010695764706749385196480966692000781820901770244415003256367588582441320021736783850733931684870645399781008639796575584441496351969572678678664660965545996833321987",
  e: 65537
}

// Verify signature
const verifyResult = window.rsaVerify(
  "Hello, RSA!", 
  signResult.signature, 
  JSON.stringify(publicKey)
)
console.log(verifyResult.valid) // true
```

### Base64 to Protobuf

```javascript
const result = window.base64ToProtobuf("CAESBHRlc3Q=")
console.log(result)
// Output: decoded Protobuf data
```

## ⚡ Performance

Typical performance in modern browsers:

| Feature | Test Case | Performance | Status |
|---------|-----------|-------------|--------|
| SHA-256 | Small text (< 1KB) | < 1ms | ✅ |
| Matrix Multiplication | 10×10 | < 1ms | ✅ |
| Matrix Multiplication | 100×100 | 10-50ms | ✅ |
| Monte Carlo (π) | 100,000 iterations | 5-15ms | ✅ |
| Monte Carlo (π) | 1,000,000 iterations | 50-100ms | ✅ |
| Monte Carlo (Integral) | 1,000,000 iterations | 40-80ms | ✅ |
| Monte Carlo (Dice) | 100,000 rolls | 10-30ms | ✅ |
| Monte Carlo (Random Walk) | 10,000 steps | 5-15ms | ✅ |
| RSA Sign | RSA-1024 | 5-20ms | ✅ |
| RSA Verify | RSA-1024 | 5-20ms | ✅ |
| Protobuf Decode | Small message | < 1ms | ✅ |

*Test environment: MacBook Pro, Chrome browser*

## 🔨 Building

### Build Commands

```bash
# Build WASM
make build

# Clean build artifacts
make clean

# Install dependencies
make install

# Run tests
make test

# Format code
make fmt

# Lint code
make lint
```

### Production Build

```bash
# Build frontend for production
cd example
npm run build

# The dist/ directory contains all static files
# Deploy to any static hosting service
```

## 🛠️ Development

### Adding New Features

1. Create a new package in `pkg/`
2. Implement your function with signature: `func(this js.Value, args []js.Value) interface{}`
3. Register the function in `main.go`
4. Create a React component in `example/src/components/`
5. Import the component in `App.jsx`

### Debugging Tips

1. Use browser DevTools Console to view logs
2. Use `println()` in Go code for debug output
3. Check Network tab to confirm WASM file loading
4. Use test.html for isolated testing

## 🌐 Browser Support

Chronos WASM works in all modern browsers that support WebAssembly:

- ✅ Chrome 57+
- ✅ Firefox 52+
- ✅ Safari 11+
- ✅ Edge 16+

### Requirements

- WebAssembly 1.0 support
- JavaScript BigInt support
- Fetch API support

## 🎨 Design Philosophy

### Go Code Design

- **Modular Architecture**: Each feature is an independent package with clear responsibilities
- **Error Handling**: All functions return objects with error information
- **Type Safety**: Leverages Go's strong type system for safety
- **Performance Optimized**: Algorithms optimized for WASM environment

### React UI Design

- **Modern UI**: Clean, professional design with subtle interactions
- **Responsive**: Adapts to various screen sizes
- **Real-time Feedback**: Shows computation time and performance metrics
- **User-Friendly**: Clear input hints and error messages

### Code Style

- Follows Go official code conventions
- Uses `gofmt` for automatic formatting
- CamelCase naming convention
- Comprehensive comments and documentation

## 📝 FAQ

### Q: WASM file is too large?

A: You can reduce file size using TinyGo:
```bash
# Install TinyGo first
tinygo build -o example/public/main.wasm -target wasm main.go
```

### Q: How to deploy to production?

A:
```bash
# Build production version
cd example
npm run build

# The dist/ directory contains all static files
# Deploy to any static hosting (Netlify, Vercel, etc.)
```

### Q: Browser doesn't support WASM?

A: Modern browsers (Chrome 57+, Firefox 52+, Safari 11+, Edge 16+) all support WASM. For older browsers, consider using polyfills or prompting users to upgrade.

## 📄 License

MIT License

## 🔗 Resources

- [Go WebAssembly Documentation](https://github.com/golang/go/wiki/WebAssembly)
- [Vite Documentation](https://vitejs.dev/)
- [React Documentation](https://react.dev/)
- [Protocol Buffers](https://protobuf.dev/)

---

<div align="center">
  <strong>Built with Go, WebAssembly, React, and Vite</strong>
  <br>
  <sub>Enjoy the power of Go in the browser! 🚀</sub>
</div>

