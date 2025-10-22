//go:build js && wasm
// +build js,wasm

package crypto

import (
	"crypto"
	"crypto/rand"
	"crypto/rsa"
	"crypto/sha256"
	"encoding/base64"
	"encoding/json"
	"math/big"
	"syscall/js"
)

// RSASign signs a message using RSA with big integers
func RSASign(this js.Value, args []js.Value) interface{} {
	if len(args) < 2 {
		return map[string]interface{}{
			"error": "missing arguments: message and privateKey required",
		}
	}

	message := args[0].String()
	privateKeyJSON := args[1].String()

	// Parse private key
	var keyData struct {
		N string `json:"n"` // modulus
		D string `json:"d"` // private exponent
		E int    `json:"e"` // public exponent
	}

	if err := json.Unmarshal([]byte(privateKeyJSON), &keyData); err != nil {
		return map[string]interface{}{
			"error": "invalid private key format: " + err.Error(),
		}
	}

	// Convert big integers
	n := new(big.Int)
	n.SetString(keyData.N, 10)
	d := new(big.Int)
	d.SetString(keyData.D, 10)

	privateKey := &rsa.PrivateKey{
		PublicKey: rsa.PublicKey{
			N: n,
			E: keyData.E,
		},
		D: d,
	}

	// Hash the message
	hashed := sha256.Sum256([]byte(message))

	// Sign
	signature, err := rsa.SignPKCS1v15(rand.Reader, privateKey, crypto.SHA256, hashed[:])
	if err != nil {
		return map[string]interface{}{
			"error": "signing failed: " + err.Error(),
		}
	}

	// Encode signature to base64
	signatureBase64 := base64.StdEncoding.EncodeToString(signature)

	return map[string]interface{}{
		"signature": signatureBase64,
	}
}

// RSAVerify verifies an RSA signature
func RSAVerify(this js.Value, args []js.Value) interface{} {
	if len(args) < 3 {
		return map[string]interface{}{
			"error": "missing arguments: message, signature, and publicKey required",
		}
	}

	message := args[0].String()
	signatureBase64 := args[1].String()
	publicKeyJSON := args[2].String()

	// Parse public key
	var keyData struct {
		N string `json:"n"` // modulus
		E int    `json:"e"` // public exponent
	}

	if err := json.Unmarshal([]byte(publicKeyJSON), &keyData); err != nil {
		return map[string]interface{}{
			"error": "invalid public key format: " + err.Error(),
		}
	}

	// Convert big integer
	n := new(big.Int)
	n.SetString(keyData.N, 10)

	publicKey := &rsa.PublicKey{
		N: n,
		E: keyData.E,
	}

	// Decode signature
	signature, err := base64.StdEncoding.DecodeString(signatureBase64)
	if err != nil {
		return map[string]interface{}{
			"error": "invalid signature encoding: " + err.Error(),
		}
	}

	// Hash the message
	hashed := sha256.Sum256([]byte(message))

	// Verify
	err = rsa.VerifyPKCS1v15(publicKey, crypto.SHA256, hashed[:], signature)
	if err != nil {
		return map[string]interface{}{
			"valid": false,
			"error": err.Error(),
		}
	}

	return map[string]interface{}{
		"valid": true,
	}
}
