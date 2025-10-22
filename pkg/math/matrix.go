//go:build js && wasm
// +build js,wasm

package math

import (
	"syscall/js"
)

// MatrixMultiply performs 100x100 matrix multiplication
func MatrixMultiply(this js.Value, args []js.Value) interface{} {
	if len(args) < 2 {
		return map[string]interface{}{
			"error": "missing arguments: two matrices required",
		}
	}

	// Parse matrices from JavaScript arrays
	matrixA := parseMatrix(args[0])
	matrixB := parseMatrix(args[1])

	if matrixA == nil || matrixB == nil {
		return map[string]interface{}{
			"error": "invalid matrix format",
		}
	}

	rowsA := len(matrixA)
	colsA := len(matrixA[0])
	rowsB := len(matrixB)
	colsB := len(matrixB[0])

	if colsA != rowsB {
		return map[string]interface{}{
			"error": "matrix dimensions incompatible for multiplication",
		}
	}

	// Perform matrix multiplication
	result := make([][]float64, rowsA)
	for i := 0; i < rowsA; i++ {
		result[i] = make([]float64, colsB)
		for j := 0; j < colsB; j++ {
			sum := 0.0
			for k := 0; k < colsA; k++ {
				sum += matrixA[i][k] * matrixB[k][j]
			}
			result[i][j] = sum
		}
	}

	// Convert result to JavaScript array
	jsResult := make([]interface{}, rowsA)
	for i := 0; i < rowsA; i++ {
		row := make([]interface{}, colsB)
		for j := 0; j < colsB; j++ {
			row[j] = result[i][j]
		}
		jsResult[i] = row
	}

	return map[string]interface{}{
		"result": jsResult,
		"rows":   rowsA,
		"cols":   colsB,
	}
}

func parseMatrix(jsValue js.Value) [][]float64 {
	if jsValue.Type() != js.TypeObject {
		return nil
	}

	length := jsValue.Length()
	if length == 0 {
		return nil
	}

	matrix := make([][]float64, length)
	for i := 0; i < length; i++ {
		row := jsValue.Index(i)
		rowLength := row.Length()
		matrix[i] = make([]float64, rowLength)
		for j := 0; j < rowLength; j++ {
			matrix[i][j] = row.Index(j).Float()
		}
	}

	return matrix
}
