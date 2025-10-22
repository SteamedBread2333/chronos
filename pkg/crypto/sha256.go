//go:build js && wasm
// +build js,wasm

package crypto

import (
	"crypto/sha256"
	"encoding/hex"
	"syscall/js"
)

// SHA256Hash computes SHA-256 hash of input string
func SHA256Hash(this js.Value, args []js.Value) interface{} {
	if len(args) < 1 {
		return map[string]interface{}{
			"error": "missing input argument",
		}
	}

	input := args[0].String()
	hash := sha256.Sum256([]byte(input))
	hexHash := hex.EncodeToString(hash[:])

	return map[string]interface{}{
		"hash": hexHash,
	}
}
