import { useState } from 'react'

function MatrixDemo() {
  const [size, setSize] = useState(100)
  const [result, setResult] = useState(null)

  const generateRandomMatrix = (n) => {
    const matrix = []
    for (let i = 0; i < n; i++) {
      const row = []
      for (let j = 0; j < n; j++) {
        row.push(Math.random() * 10)
      }
      matrix.push(row)
    }
    return matrix
  }

  const handleMultiply = () => {
    const matrixA = generateRandomMatrix(size)
    const matrixB = generateRandomMatrix(size)
    
    const startTime = performance.now()
    const multiplyResult = window.matrixMultiply(matrixA, matrixB)
    const endTime = performance.now()
    
    setResult({
      ...multiplyResult,
      time: (endTime - startTime).toFixed(2)
    })
  }

  return (
    <div className="demo-section">
      <h2>Matrix Multiplication</h2>
      <div className="input-group">
        <label>Matrix Size (N×N):</label>
        <input
          type="number"
          value={size}
          onChange={(e) => setSize(parseInt(e.target.value) || 10)}
          min="2"
          max="200"
        />
      </div>
      <button onClick={handleMultiply}>Execute {size}×{size} Matrix Multiplication</button>
      
      {result && (
        <div className="result">
          <h3>Result</h3>
          {result.error ? (
            <div className="error">{result.error}</div>
          ) : (
            <>
              <div className="matrix-info">
                <div>
                  <strong>Result Matrix Dimensions:</strong> {result.rows} × {result.cols}
                </div>
                <div>
                  <strong>Sample Value [0,0]:</strong> {result.result[0][0].toFixed(4)}
                </div>
              </div>
              <div className="performance">⚡ Computation Time: {result.time}ms</div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default MatrixDemo

