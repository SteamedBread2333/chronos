//go:build js && wasm
// +build js,wasm

package protobuf

import (
	"encoding/base64"
	"encoding/json"
	"syscall/js"

	"google.golang.org/protobuf/encoding/protojson"
	"google.golang.org/protobuf/proto"
	"google.golang.org/protobuf/types/dynamicpb"
	"google.golang.org/protobuf/types/known/anypb"
)

// Base64ToProtobuf decodes base64 string to protobuf and returns JSON representation
func Base64ToProtobuf(this js.Value, args []js.Value) interface{} {
	if len(args) < 1 {
		return map[string]interface{}{
			"error": "missing base64 input argument",
		}
	}

	base64Input := args[0].String()

	// Decode base64
	data, err := base64.StdEncoding.DecodeString(base64Input)
	if err != nil {
		return map[string]interface{}{
			"error": "base64 decode failed: " + err.Error(),
		}
	}

	// Try to decode as Any message (common protobuf wrapper)
	anyMsg := &anypb.Any{}
	if err := proto.Unmarshal(data, anyMsg); err == nil {
		// Successfully decoded as Any, try to unmarshal the contained message
		msg, err := anyMsg.UnmarshalNew()
		if err == nil {
			jsonBytes, _ := protojson.Marshal(msg)
			var jsonData interface{}
			json.Unmarshal(jsonBytes, &jsonData)
			return map[string]interface{}{
				"type":   anyMsg.TypeUrl,
				"data":   jsonData,
				"raw":    string(jsonBytes),
				"format": "any",
			}
		}
	}

	// If not Any, try generic dynamic message approach
	// For demonstration, we'll return the raw bytes info and hex representation
	return map[string]interface{}{
		"bytes":  len(data),
		"hex":    bytesToHex(data),
		"format": "raw",
		"note":   "Decoded as raw protobuf bytes. Specific message type unknown.",
	}
}

func bytesToHex(data []byte) string {
	const hexChars = "0123456789abcdef"
	result := make([]byte, len(data)*2)
	for i, b := range data {
		result[i*2] = hexChars[b>>4]
		result[i*2+1] = hexChars[b&0x0f]
	}
	return string(result)
}

// DecodeWithSchema decodes protobuf with a provided schema
func DecodeWithSchema(this js.Value, args []js.Value) interface{} {
	if len(args) < 2 {
		return map[string]interface{}{
			"error": "missing arguments: base64 input and schema required",
		}
	}

	base64Input := args[0].String()
	schemaJSON := args[1].String()

	// Decode base64
	data, err := base64.StdEncoding.DecodeString(base64Input)
	if err != nil {
		return map[string]interface{}{
			"error": "base64 decode failed: " + err.Error(),
		}
	}

	// Parse schema (simplified - in real scenario you'd use descriptor)
	var schema map[string]interface{}
	if err := json.Unmarshal([]byte(schemaJSON), &schema); err != nil {
		return map[string]interface{}{
			"error": "invalid schema: " + err.Error(),
		}
	}

	// Create dynamic message
	// Note: This is a simplified version. Full implementation would require
	// FileDescriptorSet and proper descriptor parsing
	msg := dynamicpb.NewMessage(nil)
	if err := proto.Unmarshal(data, msg); err != nil {
		return map[string]interface{}{
			"error": "protobuf decode failed: " + err.Error(),
		}
	}

	jsonBytes, _ := protojson.Marshal(msg)
	return map[string]interface{}{
		"data": string(jsonBytes),
	}
}
