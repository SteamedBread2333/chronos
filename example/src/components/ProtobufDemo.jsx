import { useState } from 'react'

function ProtobufDemo() {
  const [base64Input, setBase64Input] = useState('CAESBHRlc3Q=')
  const [result, setResult] = useState(null)

  const handleDecode = () => {
    const startTime = performance.now()
    const decodeResult = window.base64ToProtobuf(base64Input)
    const endTime = performance.now()
    
    setResult({
      ...decodeResult,
      time: (endTime - startTime).toFixed(2)
    })
  }

  const generateSampleBase64 = () => {
    // Generate a simple protobuf-like base64 for demo
    const samples = [
      'CAESBHRlc3Q=',
      'EAEYAiAD',
      'CgRuYW1lEgV2YWx1ZQ==',
    ]
    setBase64Input(samples[Math.floor(Math.random() * samples.length)])
  }

  return (
    <div className="demo-section">
      <h2>Base64 → Protobuf Decoder</h2>
      <div className="input-group">
        <label>Base64 Encoded Protobuf:</label>
        <textarea
          value={base64Input}
          onChange={(e) => setBase64Input(e.target.value)}
          placeholder="Enter base64 encoded protobuf"
        />
      </div>
      <button onClick={handleDecode}>Decode</button>
      <button onClick={generateSampleBase64}>Generate Sample</button>
      
      {result && (
        <div className="result">
          <h3>Decode Result</h3>
          {result.error ? (
            <div className="error">{result.error}</div>
          ) : (
            <>
              {result.format === 'any' ? (
                <>
                  <div><strong>Type:</strong> {result.type}</div>
                  <pre>{result.raw}</pre>
                </>
              ) : (
                <>
                  <div><strong>Bytes:</strong> {result.bytes}</div>
                  <div><strong>Hexadecimal:</strong></div>
                  <pre>{result.hex}</pre>
                  {result.note && <div style={{marginTop: '8px', color: '#666'}}>{result.note}</div>}
                </>
              )}
              <div className="performance">⚡ Decoding Time: {result.time}ms</div>
            </>
          )}
        </div>
      )}
    </div>
  )
}

export default ProtobufDemo

