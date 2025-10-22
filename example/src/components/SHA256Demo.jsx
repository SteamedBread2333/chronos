import { useState } from 'react'

function SHA256Demo() {
  const [input, setInput] = useState('Hello, WASM!')
  const [result, setResult] = useState(null)

  const handleHash = () => {
    const startTime = performance.now()
    const hashResult = window.sha256Hash(input)
    const endTime = performance.now()
    
    setResult({
      ...hashResult,
      time: (endTime - startTime).toFixed(2)
    })
  }

  return (
    <div className="demo-section">
      <h2>SHA-256 Hash</h2>
      <div className="input-group">
        <label>Input Text:</label>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter text to hash"
        />
      </div>
      <button onClick={handleHash}>Calculate Hash</button>
      
      {result && (
        <div className="result">
          <h3>Result</h3>
          {result.error ? (
            <div className="error">{result.error}</div>
          ) : (
            <>
              <div className="hash-value">{result.hash}</div>
              <div className="performance">⚡ Computation Time: {result.time}ms</div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default SHA256Demo

