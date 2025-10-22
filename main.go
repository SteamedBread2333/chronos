//go:build js && wasm
// +build js,wasm

package main

import (
	"syscall/js"

	"github.com/chronos-wasm/pkg/crypto"
	"github.com/chronos-wasm/pkg/math"
	"github.com/chronos-wasm/pkg/protobuf"
)

func main() {
	c := make(chan struct{}, 0)

	// Register all functions
	js.Global().Set("sha256Hash", js.FuncOf(crypto.SHA256Hash))
	js.Global().Set("matrixMultiply", js.FuncOf(math.MatrixMultiply))
	js.Global().Set("monteCarlo", js.FuncOf(math.MonteCarlo))
	js.Global().Set("rsaSign", js.FuncOf(crypto.RSASign))
	js.Global().Set("rsaVerify", js.FuncOf(crypto.RSAVerify))
	js.Global().Set("base64ToProtobuf", js.FuncOf(protobuf.Base64ToProtobuf))

	println("Go WASM initialized successfully!")
	<-c
}
