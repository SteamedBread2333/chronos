//go:build js && wasm
// +build js,wasm

package math

import (
	"math/rand"
	"syscall/js"
	"time"
)

// MonteCarlo performs Monte Carlo simulation to estimate Pi
func MonteCarlo(this js.Value, args []js.Value) interface{} {
	iterations := 1000000 // default
	if len(args) > 0 {
		iterations = args[0].Int()
	}

	// Seed random number generator
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))

	insideCircle := 0
	for i := 0; i < iterations; i++ {
		x := rng.Float64()
		y := rng.Float64()

		// Check if point is inside unit circle
		if x*x+y*y <= 1.0 {
			insideCircle++
		}
	}

	// Estimate Pi: (insideCircle / totalPoints) = (π/4)
	piEstimate := 4.0 * float64(insideCircle) / float64(iterations)

	return map[string]interface{}{
		"pi":         piEstimate,
		"iterations": iterations,
		"inside":     insideCircle,
	}
}
