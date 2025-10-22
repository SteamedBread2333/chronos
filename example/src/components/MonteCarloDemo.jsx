import { useState } from 'react'

function MonteCarloDemo() {
  const [iterations, setIterations] = useState(1000000)
  const [result, setResult] = useState(null)

  const handleSimulation = () => {
    const startTime = performance.now()
    const mcResult = window.monteCarlo(iterations)
    const endTime = performance.now()
    
    setResult({
      ...mcResult,
      time: (endTime - startTime).toFixed(2),
      error: Math.abs(mcResult.pi - Math.PI).toFixed(6)
    })
  }

  return (
    <div className="demo-section">
      <h2>Monte Carlo Simulation (Estimate π)</h2>
      <div className="input-group">
        <label>Iterations:</label>
        <input
          type="number"
          value={iterations}
          onChange={(e) => setIterations(parseInt(e.target.value) || 100000)}
          min="1000"
          max="10000000"
          step="100000"
        />
      </div>
      <button onClick={handleSimulation}>Run Simulation</button>
      
      {result && (
        <div className="result">
          <h3>Result</h3>
          <div className="matrix-info">
            <div>
              <strong>Estimated π:</strong> {result.pi.toFixed(8)}
            </div>
            <div>
              <strong>Actual π:</strong> {Math.PI.toFixed(8)}
            </div>
          </div>
          <div className="matrix-info">
            <div>
              <strong>Error:</strong> {result.error}
            </div>
            <div>
              <strong>Points Inside Circle:</strong> {result.inside.toLocaleString()} / {result.iterations.toLocaleString()}
            </div>
          </div>
          <div className="performance">⚡ Computation Time: {result.time}ms</div>
        </div>
      )}
    </div>
  )
}

export default MonteCarloDemo

