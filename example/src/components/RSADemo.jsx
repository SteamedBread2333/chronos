import { useState, useEffect } from 'react'

function RSADemo() {
  const [message, setMessage] = useState('Hello, RSA!')
  const [keyPair, setKeyPair] = useState(null)
  const [signature, setSignature] = useState(null)
  const [verifyResult, setVerifyResult] = useState(null)

  // Generate a simple RSA key pair for demo (larger keys to avoid "message too long" error)
  useEffect(() => {
    // These are pre-generated RSA-1024 keys for demo purposes
    // Properly generated key pair with matching n, d, e values
    const demoKeyPair = {
      privateKey: {
        n: "119648321071599662636280525066239031513861172559545055237682545016849345248559002382212779806215669109844712160945279475028257045415011034146247010695764706749385196480966692000781820901770244415003256367588582441320021736783850733931684870645399781008639796575584441496351969572678678664660965545996833321987",
        d: "33125699401614966792864976838493890585520454788999576647697193006366219766887083917848845433783667365970022732262258318730643910470919750813534017205079608840790411756744869210517388636296957049962084433345999349681275453821727256230382271421438176394286504384252162645222388934042274670324525236035765556493",
        e: 65537
      },
      publicKey: {
        n: "119648321071599662636280525066239031513861172559545055237682545016849345248559002382212779806215669109844712160945279475028257045415011034146247010695764706749385196480966692000781820901770244415003256367588582441320021736783850733931684870645399781008639796575584441496351969572678678664660965545996833321987",
        e: 65537
      }
    }
    setKeyPair(demoKeyPair)
  }, [])

  const handleSign = () => {
    if (!keyPair) return
    
    const startTime = performance.now()
    const signResult = window.rsaSign(message, JSON.stringify(keyPair.privateKey))
    const endTime = performance.now()
    
    setSignature({
      ...signResult,
      time: (endTime - startTime).toFixed(2)
    })
    setVerifyResult(null)
  }

  const handleVerify = () => {
    if (!keyPair || !signature || signature.error) return
    
    const startTime = performance.now()
    const verResult = window.rsaVerify(message, signature.signature, JSON.stringify(keyPair.publicKey))
    const endTime = performance.now()
    
    setVerifyResult({
      ...verResult,
      time: (endTime - startTime).toFixed(2)
    })
  }

  return (
    <div className="demo-section">
      <h2>RSA Digital Signature (Big Integers)</h2>
      
      {keyPair && (
        <div className="key-pair">
          <div className="key-box">
            <h4>🔐 Private Key</h4>
            <pre>{JSON.stringify(keyPair.privateKey, null, 2)}</pre>
          </div>
          <div className="key-box">
            <h4>🔓 Public Key</h4>
            <pre>{JSON.stringify(keyPair.publicKey, null, 2)}</pre>
          </div>
        </div>
      )}

      <div className="input-group">
        <label>Message:</label>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Enter message to sign"
        />
      </div>
      
      <button onClick={handleSign} disabled={!keyPair}>
        Sign Message
      </button>
      
      {signature && !signature.error && (
        <button onClick={handleVerify}>
          Verify Signature
        </button>
      )}
      
      {signature && (
        <div className="result">
          <h3>Signature Result</h3>
          {signature.error ? (
            <div className="error">{signature.error}</div>
          ) : (
            <>
              <pre>{signature.signature}</pre>
              <div className="performance">⚡ Signing Time: {signature.time}ms</div>
            </>
          )}
        </div>
      )}
      
      {verifyResult && (
        <div className="result">
          <h3>Verification Result</h3>
          <div className={`status-badge ${verifyResult.valid ? 'success' : 'error'}`}>
            {verifyResult.valid ? '✓ Signature Valid' : '✗ Signature Invalid'}
          </div>
          {verifyResult.error && <div style={{marginTop: '8px', color: '#666'}}>{verifyResult.error}</div>}
          <div className="performance">⚡ Verification Time: {verifyResult.time}ms</div>
        </div>
      )}
    </div>
  )
}

export default RSADemo

