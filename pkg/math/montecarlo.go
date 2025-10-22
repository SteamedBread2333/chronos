//go:build js && wasm
// +build js,wasm

package math

import (
	"math"
	"math/rand"
	"syscall/js"
	"time"
)

// MonteCarlo performs various Monte Carlo simulations
// Args: simulationType (string), iterations (int), optional parameters
func MonteCarlo(this js.Value, args []js.Value) any {
	if len(args) < 1 {
		return map[string]any{
			"error": "missing simulation type",
		}
	}

	simType := args[0].String()
	iterations := 1000000 // default
	if len(args) > 1 {
		iterations = args[1].Int()
	}

	if iterations <= 0 {
		return map[string]any{
			"error": "iterations must be positive",
		}
	}

	// Seed random number generator
	rng := rand.New(rand.NewSource(time.Now().UnixNano()))

	switch simType {
	case "pi":
		return estimatePi(rng, iterations)
	case "integral":
		return estimateIntegral(rng, iterations, args)
	case "dice":
		return simulateDice(rng, iterations, args)
	case "random_walk":
		return randomWalk(rng, iterations, args)
	default:
		return map[string]any{
			"error": "unknown simulation type: " + simType,
		}
	}
}

// estimatePi estimates π using Monte Carlo method
func estimatePi(rng *rand.Rand, iterations int) map[string]any {
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
	actualPi := math.Pi
	errorPercent := 100.0 * math.Abs(piEstimate-actualPi) / actualPi

	return map[string]any{
		"type":        "pi",
		"result":      piEstimate,
		"actual":      actualPi,
		"error":       errorPercent,
		"iterations":  iterations,
		"inside":      insideCircle,
		"convergence": 1.0 / math.Sqrt(float64(iterations)),
	}
}

// estimateIntegral estimates definite integral using Monte Carlo
// Estimates ∫[0,1] x² dx = 1/3
func estimateIntegral(rng *rand.Rand, iterations int, _ []js.Value) map[string]any {
	sum := 0.0
	for i := 0; i < iterations; i++ {
		x := rng.Float64()
		// Function: f(x) = x²
		sum += x * x
	}

	estimate := sum / float64(iterations)
	actual := 1.0 / 3.0 // ∫[0,1] x² dx = 1/3
	errorPercent := 100.0 * math.Abs(estimate-actual) / actual

	return map[string]any{
		"type":       "integral",
		"result":     estimate,
		"actual":     actual,
		"error":      errorPercent,
		"iterations": iterations,
		"function":   "x²",
		"interval":   "[0, 1]",
	}
}

// simulateDice simulates rolling multiple dice
func simulateDice(rng *rand.Rand, iterations int, args []js.Value) map[string]any {
	numDice := 2 // default: 2 dice
	if len(args) > 2 {
		numDice = args[2].Int()
	}

	if numDice < 1 || numDice > 10 {
		return map[string]any{
			"error": "number of dice must be between 1 and 10",
		}
	}

	// Count frequency of each sum
	minSum := numDice
	maxSum := numDice * 6
	frequency := make(map[int]int)
	sum := 0.0

	for i := 0; i < iterations; i++ {
		rollSum := 0
		for d := 0; d < numDice; d++ {
			rollSum += rng.Intn(6) + 1
		}
		frequency[rollSum]++
		sum += float64(rollSum)
	}

	// Convert frequency to percentage
	distribution := make(map[string]any)
	for s := minSum; s <= maxSum; s++ {
		percentage := 100.0 * float64(frequency[s]) / float64(iterations)
		distribution[string(rune('0'+s))] = percentage
	}

	average := sum / float64(iterations)
	expectedAvg := float64(numDice) * 3.5

	return map[string]any{
		"type":         "dice",
		"numDice":      numDice,
		"iterations":   iterations,
		"average":      average,
		"expected":     expectedAvg,
		"distribution": distribution,
		"minSum":       minSum,
		"maxSum":       maxSum,
	}
}

// randomWalk simulates 2D random walk
func randomWalk(rng *rand.Rand, iterations int, _ []js.Value) map[string]any {
	x, y := 0.0, 0.0
	maxDistance := 0.0
	distances := make([]float64, 0, iterations/100)

	for i := 0; i < iterations; i++ {
		// Random direction: 0=up, 1=right, 2=down, 3=left
		direction := rng.Intn(4)
		switch direction {
		case 0:
			y += 1
		case 1:
			x += 1
		case 2:
			y -= 1
		case 3:
			x -= 1
		}

		distance := math.Sqrt(x*x + y*y)
		if distance > maxDistance {
			maxDistance = distance
		}

		// Sample distances every 100 steps
		if i%100 == 0 {
			distances = append(distances, distance)
		}
	}

	finalDistance := math.Sqrt(x*x + y*y)
	expectedDistance := math.Sqrt(float64(iterations)) // Theoretical expectation

	return map[string]any{
		"type":             "random_walk",
		"iterations":       iterations,
		"finalX":           x,
		"finalY":           y,
		"finalDistance":    finalDistance,
		"maxDistance":      maxDistance,
		"expectedDistance": expectedDistance,
		"steps":            iterations,
	}
}
