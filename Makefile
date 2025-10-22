.PHONY: build clean install dev test

# Build WASM
build:
	@echo "Building WASM..."
	@mkdir -p example/public
	GOOS=js GOARCH=wasm go build -o example/public/main.wasm main.go
	@cp "$$(go env GOROOT)/misc/wasm/wasm_exec.js" example/public/
	@echo "Build complete!"

# Clean build artifacts
clean:
	@echo "Cleaning..."
	@rm -f example/public/main.wasm
	@rm -f example/public/wasm_exec.js
	@rm -rf example/dist
	@rm -rf example/node_modules
	@echo "Clean complete!"

# Install dependencies
install:
	@echo "Installing Go dependencies..."
	go mod download
	@echo "Installing Node dependencies..."
	cd example && npm install
	@echo "Installation complete!"

# Build and run dev server
dev: build
	@echo "Starting dev server..."
	cd example && npm run dev

# Run tests
test:
	@echo "Running Go tests..."
	go test -v ./...

# Format code
fmt:
	@echo "Formatting Go code..."
	go fmt ./...
	gofmt -s -w .

# Lint code
lint:
	@echo "Linting Go code..."
	go vet ./...

# Show help
help:
	@echo "Chronos WASM - Available Commands:"
	@echo ""
	@echo "  make build    - Build WASM binary"
	@echo "  make clean    - Clean build artifacts"
	@echo "  make install  - Install all dependencies"
	@echo "  make dev      - Build and start dev server"
	@echo "  make test     - Run Go tests"
	@echo "  make fmt      - Format Go code"
	@echo "  make lint     - Lint Go code"
	@echo "  make help     - Show this help message"
	@echo ""
	@echo "Quick start: make install && make dev"

