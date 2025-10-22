import { useState } from 'react'

function MonteCarloDemo() {
  const [simType, setSimType] = useState('pi')
  const [iterations, setIterations] = useState(1000000)
  const [numDice, setNumDice] = useState(2)
  const [result, setResult] = useState(null)

  const handleSimulation = () => {
    const startTime = performance.now()
    let mcResult
    
    console.log('Simulation Type:', simType)
    console.log('Iterations:', iterations)
    
    if (simType === 'dice') {
      mcResult = window.monteCarlo(simType, iterations, numDice)
    } else {
      mcResult = window.monteCarlo(simType, iterations)
    }
    
    console.log('Monte Carlo Result:', mcResult)
    
    const endTime = performance.now()
    
    setResult({
      ...mcResult,
      time: (endTime - startTime).toFixed(2)
    })
  }

  const renderResult = () => {
    if (!result) return null
    
    // Check if there's an error message (string), not error percentage (number)
    if (result.error && typeof result.error === 'string') {
      return <div className="error">{result.error}</div>
    }

    switch (result.type) {
      case 'pi':
        return (
          <div className="pi-result">
            <div style={{textAlign: 'center', fontSize: '0.875rem', opacity: 0.9, marginBottom: '8px'}}>
              ESTIMATED VALUE OF π
            </div>
            <div className="pi-value">
              {result.result.toFixed(8)}
            </div>
            <div style={{textAlign: 'center', fontSize: '0.875rem', opacity: 0.9, marginBottom: '16px'}}>
              Actual: {result.actual.toFixed(8)}
            </div>
            
            <div className="pi-info">
              <div className="pi-info-item">
                <strong>Error</strong>
                <div className="value">{result.error.toFixed(4)}%</div>
              </div>
              <div className="pi-info-item">
                <strong>Iterations</strong>
                <div className="value">{result.iterations.toLocaleString()}</div>
              </div>
              <div className="pi-info-item">
                <strong>Inside Circle</strong>
                <div className="value">{result.inside.toLocaleString()}</div>
              </div>
              <div className="pi-info-item">
                <strong>Convergence</strong>
                <div className="value">{result.convergence.toFixed(6)}</div>
              </div>
            </div>
            
            <div style={{textAlign: 'center', marginTop: '16px'}}>
              <span className="convergence-badge">
                🎯 Accuracy: {(100 - result.error).toFixed(2)}%
              </span>
            </div>
          </div>
        )
      
      case 'integral':
        return (
          <>
            <div className="matrix-info">
              <div>
                <strong>Function:</strong> {result.function}
              </div>
              <div>
                <strong>Interval:</strong> {result.interval}
              </div>
            </div>
            <div className="matrix-info">
              <div>
                <strong>Estimated:</strong> {result.result.toFixed(8)}
              </div>
              <div>
                <strong>Actual:</strong> {result.actual.toFixed(8)}
              </div>
            </div>
            <div className="matrix-info">
              <div>
                <strong>Error:</strong> {result.error.toFixed(4)}%
              </div>
            </div>
          </>
        )
      
      case 'dice':
        return (
          <>
            <div className="matrix-info">
              <div>
                <strong>Number of Dice:</strong> {result.numDice}
              </div>
              <div>
                <strong>Average Roll:</strong> {result.average.toFixed(2)}
              </div>
            </div>
            <div className="matrix-info">
              <div>
                <strong>Expected Average:</strong> {result.expected.toFixed(2)}
              </div>
              <div>
                <strong>Range:</strong> {result.minSum} - {result.maxSum}
              </div>
            </div>
            <div style={{marginTop: '12px'}}>
              <strong>Distribution:</strong>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))', gap: '8px', marginTop: '8px'}}>
                {Object.entries(result.distribution).map(([sum, percent]) => (
                  <div key={sum} style={{padding: '8px', background: '#f7fafc', borderRadius: '4px', textAlign: 'center', fontSize: '13px'}}>
                    <div style={{fontWeight: '600', color: '#2d3748'}}>{sum}</div>
                    <div style={{color: '#718096'}}>{percent.toFixed(1)}%</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )
      
      case 'random_walk':
        return (
          <>
            <div className="matrix-info">
              <div>
                <strong>Steps:</strong> {result.steps.toLocaleString()}
              </div>
              <div>
                <strong>Final Position:</strong> ({result.finalX.toFixed(0)}, {result.finalY.toFixed(0)})
              </div>
            </div>
            <div className="matrix-info">
              <div>
                <strong>Final Distance:</strong> {result.finalDistance.toFixed(2)}
              </div>
              <div>
                <strong>Max Distance:</strong> {result.maxDistance.toFixed(2)}
              </div>
            </div>
            <div className="matrix-info">
              <div>
                <strong>Expected Distance:</strong> {result.expectedDistance.toFixed(2)}
              </div>
            </div>
          </>
        )
      
      default:
        return <div>Unknown simulation type</div>
    }
  }

  return (
    <div className="demo-section">
      <h2>Monte Carlo Simulation</h2>
      
      <div className="input-group">
        <label>Simulation Type:</label>
        <select 
          value={simType} 
          onChange={(e) => setSimType(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            border: '1px solid #cbd5e0',
            borderRadius: '6px',
            fontSize: '14px',
            background: '#ffffff',
            cursor: 'pointer'
          }}
        >
          <option value="pi">Estimate π (Circle Method)</option>
          <option value="integral">Definite Integral (∫x² dx)</option>
          <option value="dice">Dice Rolling Simulation</option>
          <option value="random_walk">2D Random Walk</option>
        </select>
      </div>

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

      {simType === 'dice' && (
        <div className="input-group">
          <label>Number of Dice (1-10):</label>
          <input
            type="number"
            value={numDice}
            onChange={(e) => setNumDice(parseInt(e.target.value) || 2)}
            min="1"
            max="10"
          />
        </div>
      )}
      
      <button onClick={handleSimulation}>Run Simulation</button>
      
      {result && result.type === 'pi' ? (
        <div style={{marginTop: '20px'}}>
          {renderResult()}
          <div className="performance" style={{marginTop: '12px'}}>⚡ Computation Time: {result.time}ms</div>
        </div>
      ) : result && (
        <div className="result">
          <h3>Result</h3>
          {renderResult()}
          <div className="performance">⚡ Computation Time: {result.time}ms</div>
        </div>
      )}
    </div>
  )
}

export default MonteCarloDemo

