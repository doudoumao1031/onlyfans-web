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
  const [encryptedBytes, setEncryptedBytes] = useState<number[]>([])
  const [performanceStats, setPerformanceStats] = useState<{
    fileLoadTime?: number;
    encryptionTime?: number;
    decryptionTime?: number;
    fileSize?: number;
  }>({})

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
        // if (originalData) {
        //   const encoder = new TextEncoder()
        //   const bytes = Array.from(encoder.encode(originalData))
        //   setOriginalBytes(bytes)
        // } else {
        //   setOriginalBytes([])
        // }
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
      if (!originalData.trim() && originalBytes.length === 0) {
        setError("Please enter data to encrypt")
        return
      }

      // Get the bytes to encrypt - use originalBytes if available (for large files)
      const bytesToEncrypt = originalBytes.length > 0
        ? originalBytes
        : isInputBytes
          ? parseByteArray(originalData)
          : Array.from(new TextEncoder().encode(originalData))

      // Validate bytes - ensure all values are between 0-255
      for (let i = 0; i < bytesToEncrypt.length; i++) {
        if (bytesToEncrypt[i] < 0 || bytesToEncrypt[i] > 255) {
          setError(`Invalid byte value at position ${i}: ${bytesToEncrypt[i]}. Must be between 0-255.`)
          return
        }
      }

      // Measure encryption time
      const startTime = performance.now()

      // Encrypt the data
      const encryptedResult = Array.from(cryptoModule.simpleEncrypt(new Uint8Array(bytesToEncrypt)))

      // Verify the sizes match
      if (encryptedResult.length !== bytesToEncrypt.length) {
        setError(`Size mismatch: Original data has ${bytesToEncrypt.length} bytes, but encrypted data has ${encryptedResult.length} bytes.`)
        return
      }

      // Store the full encrypted bytes
      setEncryptedBytes(encryptedResult)

      // Calculate encryption time
      const endTime = performance.now()
      const encryptionTime = endTime - startTime

      // Update performance stats
      setPerformanceStats(prev => ({
        ...prev,
        encryptionTime
      }))

      // Convert to string for display - limit to first 1000 bytes for very large files
      const displayBytes = encryptedResult.slice(0, 1000)
      if (encryptedResult.length > 1000) {
        setEncryptedData(displayBytes.join(", ") + ` ... (${encryptedResult.length - 1000} more bytes)`)
      } else {
        setEncryptedData(encryptedResult.join(", "))
      }

      // Show performance info
      setError(`Encryption completed in ${encryptionTime.toFixed(2)}ms for ${bytesToEncrypt.length.toLocaleString()} bytes. Original: ${bytesToEncrypt.length}, Encrypted: ${encryptedResult.length}`)
    } catch (err) {
      console.error("Encryption error:", err)
      setError(`Encryption failed: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  const handleDecrypt = () => {
    try {
      setError("")
      if (!encryptedData.trim() && encryptedBytes.length === 0) {
        setError("Please encrypt data first")
        return
      }

      // Get the bytes to decrypt - use encryptedBytes if available (for large files)
      const bytesToDecrypt = encryptedBytes.length > 0
        ? encryptedBytes
        : parseByteArray(encryptedData)

      // Validate bytes - ensure all values are between 0-255
      for (let i = 0; i < bytesToDecrypt.length; i++) {
        if (bytesToDecrypt[i] < 0 || bytesToDecrypt[i] > 255) {
          setError(`Invalid byte value at position ${i}: ${bytesToDecrypt[i]}. Must be between 0-255.`)
          return
        }
      }

      // Measure decryption time
      const startTime = performance.now()

      // Decrypt the data
      const decryptedResult = Array.from(cryptoModule.simpleDecrypt(new Uint8Array(bytesToDecrypt)))

      // Verify the sizes match
      if (decryptedResult.length !== bytesToDecrypt.length) {
        setError(`Size mismatch: Encrypted data has ${bytesToDecrypt.length} bytes, but decrypted data has ${decryptedResult.length} bytes.`)
        return
      }

      // Store the full decrypted bytes
      setDecryptedBytes(decryptedResult)

      // Calculate decryption time
      const endTime = performance.now()
      const decryptionTime = endTime - startTime

      // Update performance stats
      setPerformanceStats(prev => ({
        ...prev,
        decryptionTime
      }))

      // Convert to string for display - limit to first 1000 bytes for very large files
      const displayBytes = decryptedResult.slice(0, 1000)
      if (decryptedResult.length > 1000) {
        setDecryptedData(displayBytes.join(", ") + ` ... (${decryptedResult.length - 1000} more bytes)`)
      } else {
        setDecryptedData(decryptedResult.join(", "))
      }

      // Show performance info
      setError(`Decryption completed in ${decryptionTime.toFixed(2)}ms for ${bytesToDecrypt.length.toLocaleString()} bytes. Encrypted: ${bytesToDecrypt.length}, Decrypted: ${decryptedResult.length}`)
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
    setEncryptedBytes([])
    setError("")
    setFileName("")
    setIsInputBytes(false)
    setPerformanceStats({
      fileLoadTime: 0,
      encryptionTime: 0,
      decryptionTime: 0,
      fileSize: 0
    })
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

    // Check file size (200MB limit)
    const MAX_FILE_SIZE = 200 * 1024 * 1024 // 200MB in bytes
    if (file.size > MAX_FILE_SIZE) {
      setError(`File too large: ${(file.size / (1024 * 1024)).toFixed(2)}MB. Maximum size is 200MB.`)
      return
    }

    setFileName(file.name)
    setError(`Loading file: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB)...`)

    // Start timing
    const startTime = performance.now()

    const reader = new FileReader()
    reader.onload = (e) => {
      const arrayBuffer = e.target?.result as ArrayBuffer
      if (!arrayBuffer) {
        setError("Failed to read file")
        return
      }

      // Calculate load time
      const endTime = performance.now()
      const fileLoadTime = endTime - startTime

      // Update performance stats
      setPerformanceStats({
        fileLoadTime,
        fileSize: file.size
      })

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

      // Clear any previous encryption/decryption data
      setEncryptedData("")
      setEncryptedBytes([])
      setDecryptedData("")
      setDecryptedBytes([])

      // Show performance info
      setError(`File loaded in ${fileLoadTime.toFixed(2)}ms: ${file.name} (${(file.size / (1024 * 1024)).toFixed(2)}MB, ${bytes.length.toLocaleString()} bytes)`)
    }

    reader.onerror = () => {
      setError("Error reading file")
    }

    reader.readAsArrayBuffer(file)
  }

  // Function to download the encrypted file
  const downloadEncryptedFile = () => {
    if (!encryptedData && encryptedBytes.length === 0) {
      setError("No encrypted data to download")
      return
    }

    try {
      // Use stored encrypted bytes if available, otherwise parse from display
      const bytes = encryptedBytes.length > 0
        ? encryptedBytes
        : parseByteArray(encryptedData)

      // Create a Blob from the encrypted bytes
      const blob = new Blob([new Uint8Array(bytes)])

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
    try {
      if (decryptedBytes.length === 0) {
        setError("Please decrypt data first")
        return
      }

      // Create a blob from the decrypted bytes
      const blob = new Blob([new Uint8Array(decryptedBytes)])

      // Create a download link
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = fileName || "decrypted_file"
      document.body.appendChild(a)
      a.click()

      // Clean up
      URL.revokeObjectURL(url)
      document.body.removeChild(a)

      setError(`File downloaded: ${fileName || "decrypted_file"} (${decryptedBytes.length.toLocaleString()} bytes)`)
    } catch (err) {
      console.error("Download error:", err)
      setError(`Download failed: ${err instanceof Error ? err.message : String(err)}`)
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
            <p className="text-sm text-gray-tertiary mt-2 flex-grow">
              Loads a predefined test case with known input and expected output for testing and demonstration purposes.
            </p>
          </div>

          {(performanceStats.fileLoadTime !== undefined ||
            performanceStats.encryptionTime !== undefined ||
            performanceStats.decryptionTime !== undefined) && (
            <div className="mb-4 p-4 bg-background-primary rounded-md border border-gray-quaternary">
              <h2 className="text-lg font-semibold mb-2 text-gray-primary">Performance Statistics</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {performanceStats.fileLoadTime !== undefined && (
                  <div>
                    <p className="text-sm font-medium text-gray-secondary">File Load Time</p>
                    <p className="text-lg text-theme">{performanceStats.fileLoadTime.toFixed(2)} ms</p>
                    {performanceStats.fileSize && (
                      <p className="text-xs text-gray-tertiary">
                        File size: {(performanceStats.fileSize / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    )}
                  </div>
                )}
                {performanceStats.encryptionTime !== undefined && (
                  <div>
                    <p className="text-sm font-medium text-gray-secondary">Encryption Time</p>
                    <p className="text-lg text-theme">{performanceStats.encryptionTime.toFixed(2)} ms</p>
                    {originalBytes.length > 0 && (
                      <p className="text-xs text-gray-tertiary">
                        {originalBytes.length.toLocaleString()} bytes processed
                      </p>
                    )}
                  </div>
                )}
                {performanceStats.decryptionTime !== undefined && (
                  <div>
                    <p className="text-sm font-medium text-gray-secondary">Decryption Time</p>
                    <p className="text-lg text-theme">{performanceStats.decryptionTime.toFixed(2)} ms</p>
                    {decryptedBytes.length > 0 && (
                      <p className="text-xs text-gray-tertiary">
                        {decryptedBytes.length.toLocaleString()} bytes processed
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}

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
            <div className="mt-4 p-3 bg-theme/10 rounded-md border border-theme/30">
              <h3 className="text-sm font-semibold text-theme mb-1">Large File Support</h3>
              <p className="text-xs text-gray-secondary">
                This tool supports files up to 200MB. For large files, only the first 1000 bytes are displayed in the text areas,
                but the entire file is processed during encryption and decryption. Performance statistics are shown to help assess
                processing time for different file sizes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
