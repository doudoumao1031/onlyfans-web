/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"
import * as cryptoModule from "@/lib/crypto"

// Import crypto functions
// Note: We're using dynamic import to avoid SSR issues with the crypto module
const DEFAULT_KEY = "s!*K@wl.zeo&{"

export default function DataCryptoPage() {
  const [originalData, setOriginalData] = useState("")
  const [encryptedData, setEncryptedData] = useState("")
  const [decryptedData, setDecryptedData] = useState("")
  const [decryptedBytes, setDecryptedBytes] = useState<number[]>([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [customKey, setCustomKey] = useState(DEFAULT_KEY)
  const [error, setError] = useState("")
  const [isInputBytes, setIsInputBytes] = useState(false)
  const [fileName, setFileName] = useState("")
  const [originalBytes, setOriginalBytes] = useState<number[]>([])

  // Set up the crypto module
  useEffect(() => {
    try {
      // Initialize with default key
      cryptoModule.setKey(DEFAULT_KEY)
      setIsLoaded(true)
    } catch (err) {
      console.error("Failed to initialize crypto module:", err)
      setError(`Failed to initialize crypto module: ${err instanceof Error ? err.message : String(err)}`)
    }
  }, [])

  // Detect if input is a byte array or text
  useEffect(() => {
    try {
      // Check if the input matches the pattern for a byte array
      const isByteArray = /^(\d+\s*,\s*)*\d+$/.test(originalData.trim())

      if (isByteArray && originalData.trim()) {
        // Try to parse it as a byte array
        const bytes = parseByteArray(originalData)
        setIsInputBytes(true)
        setOriginalBytes(bytes)
      } else {
        setIsInputBytes(false)
        // For text input, convert to bytes for storage
        if (originalData) {
          const encoder = new TextEncoder()
          const bytes = Array.from(encoder.encode(originalData))
          setOriginalBytes(bytes)
        } else {
          setOriginalBytes([])
        }
      }
    } catch (err) {
      // If parsing fails, it's probably not a valid byte array
      setIsInputBytes(false)
      console.error("Error detecting input type:", err)
    }
  }, [originalData])

  // Parse input data to Uint8Array, handling both text and byte array formats
  const parseInputData = (input: string, isBytes: boolean): Uint8Array => {
    if (isBytes) {
      // Parse comma-separated byte array
      // Remove any surrounding quotes
      const cleanInput = input.trim().replace(/^["']|["']$/g, "")

      const values = cleanInput.split(",").map(num => {
        const parsed = parseInt(num.trim(), 10)
        if (isNaN(parsed) || parsed < 0 || parsed > 255) {
          throw new Error(`Invalid byte value: ${num}. Must be between 0-255.`)
        }
        return parsed
      })
      return new Uint8Array(values)
    } else {
      // Convert text to bytes
      const encoder = new TextEncoder()
      return encoder.encode(input)
    }
  }

  const handleEncrypt = () => {
    try {
      setError("")
      if (!originalData.trim()) {
        setError("Please enter data to encrypt")
        return
      }

      // Get the bytes to encrypt
      const bytesToEncrypt = isInputBytes
        ? parseByteArray(originalData)
        : Array.from(new TextEncoder().encode(originalData))

      // Encrypt the data
      const encryptedBytes = Array.from(cryptoModule.simpleEncrypt(new Uint8Array(bytesToEncrypt)))

      // Convert to string for display
      setEncryptedData(encryptedBytes.join(", "))
    } catch (err) {
      console.error("Encryption error:", err)
      setError(`Encryption failed: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const handleDecrypt = () => {
    try {
      setError("")
      if (!encryptedData) {
        setError("Please provide encrypted data to decrypt.")
        return
      }

      // Parse the encrypted data string into a byte array
      const encryptedBytes = parseByteArray(encryptedData)

      // Decrypt the data
      const decryptedBytes = Array.from(cryptoModule.simpleDecrypt(new Uint8Array(encryptedBytes)))

      // Try to convert to text if it seems like text data
      // Check if the decrypted bytes look like text (ASCII range)
      const isLikelyText = decryptedBytes.every(byte =>
        (byte >= 32 && byte <= 126) || // printable ASCII
        [9, 10, 13].includes(byte)     // tab, newline, carriage return
      )

      if (isLikelyText) {
        // If it looks like text, convert to string
        const decoder = new TextDecoder()
        setDecryptedData(decoder.decode(new Uint8Array(decryptedBytes)))
      } else {
        // If it looks like binary data, keep as byte array
        setDecryptedData(decryptedBytes.join(", "))
      }

      // Store the original format for download purposes
      setDecryptedBytes(decryptedBytes)
    } catch (err) {
      console.error("Decryption error:", err)
      setError(`Decryption failed: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const parseByteArray = (input: string): number[] => {
    const values = input.split(",").map(num => {
      const parsed = parseInt(num.trim(), 10)
      if (isNaN(parsed) || parsed < 0 || parsed > 255) {
        throw new Error(`Invalid byte value: ${num}. Must be between 0-255.`)
      }
      return parsed
    })
    return values
  }

  // Remove quotes from input
  const removeQuotes = () => {
    setOriginalData(originalData.replace(/^["']|["']$/g, ""))
  }

  // Reset the encryption key to default
  const resetKey = () => {
    setCustomKey(DEFAULT_KEY)
    cryptoModule.setKey(DEFAULT_KEY)
  }

  // Clear all input and output fields
  const clearAll = () => {
    setOriginalData("")
    setEncryptedData("")
    setDecryptedData("")
    setDecryptedBytes([])
    setOriginalBytes([])
    setError("")
    setFileName("")
    setIsInputBytes(false)
  }

  // Load a test case
  const loadTestCase = () => {
    const testText = "Hello, world! This is a test."
    setOriginalData(testText)
    setIsInputBytes(false)
    setEncryptedData("")
    setDecryptedData("")
    setDecryptedBytes([])
    setFileName("")
    setError("Test case loaded. Click 'Encrypt' to encrypt the test message.")

    // Also convert to bytes for storage
    const encoder = new TextEncoder()
    const bytes = Array.from(encoder.encode(testText))
    setOriginalBytes(bytes)
  }

  // Function to handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)

    const reader = new FileReader()
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer
      if (!arrayBuffer) {
        setError("Failed to read file")
        return
      }

      // Convert to byte array
      const bytes = Array.from(new Uint8Array(arrayBuffer))

      // Limit display to first 1000 bytes for performance
      const displayBytes = bytes.slice(0, 1000)
      const displayText = displayBytes.join(", ")

      if (bytes.length > 1000) {
        setOriginalData(displayText + ` ... (${bytes.length - 1000} more bytes)`)
      } else {
        setOriginalData(displayText)
      }

      // Store the full bytes for encryption
      setOriginalBytes(bytes)
      setIsInputBytes(true)
    }

    reader.onerror = () => {
      setError("Error reading file")
    }

    reader.readAsArrayBuffer(file)
  }

  // Function to download the encrypted file
  const downloadEncryptedFile = () => {
    if (!encryptedData) {
      setError("No encrypted data to download")
      return
    }

    try {
      // Parse the encrypted data string into a byte array
      const encryptedBytes = parseByteArray(encryptedData)

      // Create a Blob from the encrypted bytes
      const blob = new Blob([new Uint8Array(encryptedBytes)])

      // Create a download link
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url

      // Use the original filename if available, otherwise use a default name
      const downloadName = fileName ?
        `encrypted_${fileName}` :
        "encrypted_file.bin"

      a.download = downloadName
      document.body.appendChild(a)
      a.click()

      // Clean up
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("Download error:", err)
      setError(`Failed to download file: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // Function to download decrypted data as a file
  const downloadDecryptedFile = () => {
    if (!decryptedBytes || decryptedBytes.length === 0) {
      setError("No decrypted data to download.")
      return
    }

    try {
      // Create a Blob from the decrypted bytes
      const blob = new Blob([new Uint8Array(decryptedBytes)])

      // Create a download link
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url

      // Use the original filename if available, otherwise use a default name
      const downloadName = fileName ?
        `decrypted_${fileName}` :
        `decrypted_file${isInputBytes ? ".bin" : ".txt"}`

      a.download = downloadName
      document.body.appendChild(a)
      a.click()

      // Clean up
      URL.revokeObjectURL(url)
      document.body.removeChild(a)
    } catch (err) {
      console.error("Download error:", err)
      setError(`Failed to download file: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <div className="container mx-auto p-4 max-w-4xl">
        <div className="bg-background-secondary p-6 rounded-lg shadow-md mb-6">
          <h1 className="text-2xl font-bold mb-4 text-gray-primary">Data Crypto Testing</h1>

          {error && (
            <div className="mb-4 p-4 bg-pink/10 border border-pink rounded-md">
              <p className="text-gray-primary">{error}</p>
            </div>
          )}

          <div className="mb-4 flex items-end gap-2">
            <div className="flex-grow">
              <label className="block text-sm font-medium mb-2">
                Custom Encryption Key:
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  className="flex-grow p-2 border border-gray-quaternary rounded-md focus:outline-none focus:ring-1 focus:ring-theme"
                  placeholder="Enter custom encryption key"
                />
              </div>
            </div>
            <button
              onClick={resetKey}
              disabled={!isLoaded}
              className="px-4 py-2 bg-orange text-white rounded-md hover:bg-orange/80"
            >
              Reset Key
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-primary mb-2">
                Original Data (Text or Byte Array)
              </label>
              <textarea
                className="w-full p-2 border border-gray-quaternary rounded-md focus:outline-none focus:ring-1 focus:ring-theme"
                rows={5}
                value={originalData}
                onChange={(e) => setOriginalData(e.target.value)}
                placeholder="Enter text or comma-separated byte values (0-255)"
              />
              <div className="mt-2 text-sm text-gray-tertiary">
                Current format: {isInputBytes ? "Byte Array" : "Text"}
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={handleEncrypt}
                  className="px-4 py-2 bg-theme text-white rounded-md hover:bg-theme/80"
                >
                  Encrypt
                </button>
                <button
                  onClick={removeQuotes}
                  className="px-4 py-2 bg-orange text-white rounded-md hover:bg-orange/80"
                >
                  Remove Quotes
                </button>
                <div className="relative">
                  <button
                    onClick={() => document.getElementById("file-upload")?.click()}
                    className="px-4 py-2 bg-green text-white rounded-md hover:bg-green/80"
                  >
                    Upload File
                  </button>
                  <input
                    id="file-upload"
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                {fileName && (
                  <div className="mt-2 text-sm text-gray-tertiary">
                    Loaded file: <span className="text-theme">{fileName}</span>
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-primary mb-2">
                Encrypted Data (Byte Array)
              </label>
              <textarea
                className="w-full p-2 border border-gray-quaternary rounded-md focus:outline-none focus:ring-1 focus:ring-theme"
                rows={5}
                value={encryptedData}
                onChange={(e) => setEncryptedData(e.target.value)}
                placeholder="Encrypted data will appear here"
                readOnly
              />
              <div className="flex flex-wrap gap-2 mt-2">
                <button
                  onClick={handleDecrypt}
                  className="px-4 py-2 bg-theme text-white rounded-md hover:bg-theme/80"
                  disabled={!encryptedData}
                >
                  Decrypt
                </button>
                <button
                  onClick={downloadEncryptedFile}
                  className="px-4 py-2 bg-purple text-white rounded-md hover:bg-purple/80"
                  disabled={!encryptedData}
                >
                  Download File
                </button>
              </div>
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-primary mb-2">
              Decrypted Data
            </label>
            <textarea
              className="w-full p-2 border border-gray-quaternary rounded-md focus:outline-none focus:ring-1 focus:ring-theme"
              rows={5}
              value={decryptedData}
              readOnly
              placeholder="Decrypted data will appear here"
            />
            <div className="flex flex-wrap gap-2 mt-2">
              <button
                onClick={downloadDecryptedFile}
                className="px-4 py-2 bg-purple text-white rounded-md hover:bg-purple/80"
                disabled={!decryptedData}
              >
                Download File
              </button>
            </div>
          </div>

          <div className="mb-4 flex gap-2">
            <button
              onClick={loadTestCase}
              className="px-4 py-2 bg-purple text-white rounded-md hover:bg-purple/80"
            >
              Load Test Case
            </button>
            <button
              onClick={clearAll}
              className="px-4 py-2 bg-pink text-white rounded-md hover:bg-pink/80"
            >
              Clear All
            </button>
            <p className="text-sm text-gray-600 mt-2 flex-grow">
              Loads a predefined test case with known input and expected output for testing and demonstration purposes.
            </p>
          </div>

          <div className="bg-background-primary p-4 rounded-md border border-gray-quaternary">
            <h2 className="text-lg font-semibold mb-2 text-gray-primary">How to use:</h2>
            <ol className="list-decimal list-inside space-y-1 text-gray-secondary">
              <li>Enter text or a comma-separated byte array in the Original Data field</li>
              <li>Click &quot;Encrypt&quot; to convert it to an encrypted byte array</li>
              <li>Or enter an encrypted byte array in the Encrypted Data field</li>
              <li>Click &quot;Decrypt&quot; to convert it back to the original text</li>
              <li>Optionally, provide a custom encryption key</li>
              <li>Use &quot;Load Test Case&quot; to try with a predefined example</li>
              <li>Use &quot;Reset Key&quot; to restore the default encryption key</li>
              <li>Use &quot;Clear All&quot; to reset all input and output fields</li>
              <li>Use &quot;Remove Quotes&quot; to remove quotes from the input</li>
              <li>Use the file input to load a file and convert it to a byte array</li>
              <li>Use &quot;Download Encrypted File&quot; to save the encrypted data as a file</li>
              <li>Use &quot;Download Decrypted File&quot; to save the decrypted data as a file</li>
            </ol>
          </div>
        </div>
      </div>
    </main>
  )
}
