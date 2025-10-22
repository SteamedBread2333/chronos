import { useState, useEffect } from 'react'
import SHA256Demo from './components/SHA256Demo'
import MatrixDemo from './components/MatrixDemo'
import MonteCarloDemo from './components/MonteCarloDemo'
import RSADemo from './components/RSADemo'
import ProtobufDemo from './components/ProtobufDemo'

function App() {
  const [wasmReady, setWasmReady] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    const loadWasm = async () => {
      try {
        // Load wasm_exec.js
        const go = new window.Go()
        
        // Fetch and instantiate WASM
        const response = await fetch('/main.wasm')
        const buffer = await response.arrayBuffer()
        const result = await WebAssembly.instantiate(buffer, go.importObject)
        
        // Run the Go program
        go.run(result.instance)
        
        // Wait a bit for initialization
        setTimeout(() => {
          setWasmReady(true)
        }, 100)
      } catch (err) {
        console.error('Failed to load WASM:', err)
        setError(err.message)
      }
    }

    // Load wasm_exec.js script first
    const script = document.createElement('script')
    script.src = '/wasm_exec.js'
    script.onload = loadWasm
    script.onerror = () => setError('Failed to load wasm_exec.js')
    document.body.appendChild(script)

    return () => {
      document.body.removeChild(script)
    }
  }, [])

  if (error) {
    return (
      <div className="container">
        <h1>Chronos WASM Demo</h1>
        <div className="error">
          <strong>Error loading WASM:</strong> {error}
        </div>
      </div>
    )
  }

  if (!wasmReady) {
    return (
      <div className="container">
        <div className="loading">Loading WASM module...</div>
      </div>
    )
  }

  return (
    <div className="container">
      <h1>Chronos WASM</h1>
      <p className="subtitle">
        Go WebAssembly Demonstrations: Cryptography, Mathematics & Data Processing
      </p>

      <SHA256Demo />
      <MatrixDemo />
      <MonteCarloDemo />
      <RSADemo />
      <ProtobufDemo />
    </div>
  )
}

export default App

