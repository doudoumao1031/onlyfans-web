/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useEffect } from "react"

// Import crypto functions
// Note: We're using dynamic import to avoid SSR issues with the crypto module
let cryptoModule: any = null
const DEFAULT_KEY = "s!*K@wl.zeo&{"

export default function DataCryptoPage() {
  const [originalData, setOriginalData] = useState("")
  const [encryptedData, setEncryptedData] = useState("")
  const [decryptedData, setDecryptedData] = useState("")
  const [isLoaded, setIsLoaded] = useState(false)
  const [customKey, setCustomKey] = useState(DEFAULT_KEY)
  const [error, setError] = useState("")
  const [isInputBytes, setIsInputBytes] = useState(false)

  useEffect(() => {
    // Dynamically import the crypto module on client-side
    import("@/lib/crypto").then((module) => {
      cryptoModule = module
      // Set the default key when the module is loaded
      cryptoModule.setKey(DEFAULT_KEY)
      setIsLoaded(true)
    }).catch(err => {
      setError(`Failed to load crypto module: ${err.message}`)
    })
  }, [])

  // Detect if input is a byte array or text
  useEffect(() => {
    try {
      // Check if the input looks like a comma-separated byte array
      // Trim whitespace and quotes before testing
      const trimmedInput = originalData.trim().replace(/^["']|["']$/g, '');
      
      if (trimmedInput && /^(\d+\s*,\s*)*\d+$/.test(trimmedInput)) {
        setIsInputBytes(true);
      } else {
        setIsInputBytes(false);
      }
    } catch (err) {
      setIsInputBytes(false);
    }
  }, [originalData])

  // Parse input data to Uint8Array, handling both text and byte array formats
  const parseInputData = (input: string, isBytes: boolean): Uint8Array => {
    if (isBytes) {
      // Parse comma-separated byte array
      // Remove any surrounding quotes
      const cleanInput = input.trim().replace(/^["']|["']$/g, '');
      
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
      if (!isLoaded) {
        setError("Crypto module not loaded yet")
        return
      }

      if (!originalData.trim()) {
        setError("Please enter some text or bytes to encrypt")
        return
      }

      // Check if input has quotes and suggest using the Remove Quotes button
      if (originalData.startsWith('"') && originalData.endsWith('"') && isInputBytes === false) {
        setError("Your input appears to be a quoted byte array. Try clicking 'Remove Quotes' first.")
        return
      }

      // Apply custom key if provided
      if (customKey.trim()) {
        cryptoModule.setKey(customKey)
      }

      // Parse input data
      const dataArray = parseInputData(originalData, isInputBytes)

      // Encrypt the data
      const encrypted = cryptoModule.simpleEncrypt(dataArray)

      // Convert to readable format for display
      setEncryptedData(Array.from(encrypted).join(", "))

      // For debugging purposes, log the first few bytes
      console.log("First few bytes of input:", Array.from(dataArray).slice(0, 5))
      console.log("First few bytes of output:", Array.from(encrypted).slice(0, 5))

      setError("")
    } catch (err: any) {
      setError(`Encryption error: ${err.message}`)
    }
  }

  const handleDecrypt = () => {
    try {
      if (!isLoaded) {
        setError("Crypto module not loaded yet")
        return
      }

      if (!encryptedData.trim()) {
        setError("Please enter encrypted data to decrypt")
        return
      }

      // Validate input format
      if (!/^(\d+\s*,\s*)*\d+$/.test(encryptedData.trim())) {
        setError("Encrypted data must be a comma-separated list of numbers")
        return
      }

      // Apply custom key if provided
      if (customKey.trim()) {
        cryptoModule.setKey(customKey)
      }

      // Parse the comma-separated numbers into a Uint8Array
      const encryptedArray = new Uint8Array(
        encryptedData.split(",").map(num => {
          const parsed = parseInt(num.trim(), 10)
          if (isNaN(parsed) || parsed < 0 || parsed > 255) {
            throw new Error(`Invalid byte value: ${num}. Must be between 0-255.`)
          }
          return parsed
        })
      )

      // For debugging purposes, log the first few bytes of input
      console.log("First few bytes of encrypted input:", Array.from(encryptedArray).slice(0, 5))

      // Decrypt the data
      const decrypted = cryptoModule.simpleDecrypt(encryptedArray)

      // For debugging purposes, log the first few bytes of output
      console.log("First few bytes of decrypted output:", Array.from(decrypted).slice(0, 5))

      // Try to convert back to text
      try {
        const decoder = new TextDecoder()
        setDecryptedData(decoder.decode(decrypted))
      } catch (e) {
        // If decoding as text fails, show as byte array
        setDecryptedData(`Byte array: ${Array.from(decrypted).join(", ")}`)
      }

      setError("")
    } catch (err: any) {
      setError(`Decryption error: ${err.message}`)
    }
  }

  // Reset the encryption key to default
  const resetKey = () => {
    try {
      if (!isLoaded) {
        setError("Crypto module not loaded yet")
        return
      }

      cryptoModule.setKey(DEFAULT_KEY)
      setCustomKey(DEFAULT_KEY)
      setError("")
    } catch (err: any) {
      setError(`Error resetting key: ${err.message}`)
    }
  }

  // Test case data
  const testCaseOriginal = [100, 100, 115, 230, 152, 175, 229, 156, 176, 230, 150, 185, 231, 172, 172, 228, 184, 137, 230, 150, 185, 228, 189, 134, 230, 152, 175, 230, 150, 185, 229, 188, 143, 229, 156, 176, 230, 150, 185, 231, 154, 132, 232, 140, 131, 229, 190, 183, 232, 144, 168, 232, 140, 131, 229, 190, 183, 232, 144, 168, 231, 154, 132, 229, 156, 176, 230, 150, 185, 231, 154, 132, 230, 152, 175, 229, 144, 166, 230, 150, 185, 230, 179, 149, 229, 156, 176, 230, 150, 185, 231, 154, 132, 229, 143, 141, 229, 175, 185, 229, 143, 141, 229, 175, 185]
  const testCaseEncrypted = [15, 15, 24, 141, 243, 196, 142, 247, 219, 141, 253, 210, 140, 199, 199, 143, 211, 226, 141, 253, 210, 143, 214, 237, 141, 243, 196, 141, 253, 210, 142, 215, 228, 142, 247, 219, 141, 253, 210, 140, 241, 239, 131, 231, 232, 142, 213, 220, 131, 251, 195, 131, 231, 232, 142, 213, 220, 131, 251, 195, 140, 241, 239, 142, 247, 219, 141, 253, 210, 140, 241, 239, 141, 243, 196, 142, 251, 205, 141, 253, 210, 141, 216, 254, 142, 247, 219, 141, 253, 210, 140, 241, 239, 142, 228, 230, 142, 196, 210, 142, 228, 230, 142, 196, 210]

  const loadTestCase = () => {
    try {
      // Reset key to default first
      cryptoModule.setKey(DEFAULT_KEY)
      setCustomKey(DEFAULT_KEY)

      // Load the test case data
      setOriginalData(testCaseOriginal.join(", "))
      setEncryptedData(testCaseEncrypted.join(", "))
      setIsInputBytes(true)

      // Try to decode the original data as text
      try {
        const decoder = new TextDecoder()
        const textData = decoder.decode(new Uint8Array(testCaseOriginal))
        setDecryptedData(textData)
      } catch (e) {
        setDecryptedData("(Binary data, cannot display as text)")
      }

      setError("")
    } catch (err: any) {
      setError(`Error loading test case: ${err.message}`)
    }
  }

  // Clear all fields
  const clearAll = () => {
    setOriginalData("")
    setEncryptedData("")
    setDecryptedData("")
    setError("")
  }

  // Remove quotes from input if present
  const removeQuotes = () => {
    try {
      // Handle the case where input is wrapped in quotes
      if (originalData.startsWith('"') && originalData.endsWith('"')) {
        const cleanInput = originalData.slice(1, -1);
        setOriginalData(cleanInput);
        // Force detection as bytes
        setIsInputBytes(true);
        setError("");
      } else {
        setError("No quotes detected in the input");
      }
    } catch (err: any) {
      setError(`Error processing input: ${err.message}`);
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4">
      <div className="container mx-auto p-4 max-w-4xl">
        <h1 className="text-2xl font-bold mb-4">Data Crypto Testing</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <div className="mb-4 flex items-end gap-2">
          <div className="flex-grow">
            <label className="block text-sm font-medium mb-2">
              Custom Encryption Key (optional):
              <input
                type="text"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Enter a custom key"
              />
            </label>
          </div>
          <button
            onClick={resetKey}
            disabled={!isLoaded}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 disabled:bg-gray-400"
          >
            Reset Key
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Original Data {isInputBytes ? "(detected as bytes)" : "(detected as text)"}:
              <textarea
                value={originalData}
                onChange={(e) => setOriginalData(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows={6}
                placeholder="Enter text or byte array to encrypt"
              />
            </label>
            <button
              onClick={handleEncrypt}
              disabled={!isLoaded}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400"
            >
              Encrypt
            </button>
            <button
              onClick={removeQuotes}
              className="mt-2 px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
            >
              Remove Quotes
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Encrypted Data (comma-separated bytes):
              <textarea
                value={encryptedData}
                onChange={(e) => setEncryptedData(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                rows={6}
                placeholder="Enter encrypted byte array to decrypt"
              />
            </label>
            <button
              onClick={handleDecrypt}
              disabled={!isLoaded}
              className="mt-2 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:bg-gray-400"
            >
              Decrypt
            </button>
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">
            Decrypted Result:
            <textarea
              value={decryptedData}
              readOnly
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm bg-gray-50"
              rows={4}
            />
          </label>
        </div>

        <div className="mb-4 flex gap-2">
          <button
            onClick={loadTestCase}
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Load Test Case
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Clear All
          </button>
          <p className="text-sm text-gray-600 mt-2 flex-grow">
            Loads the predefined test case with known input and expected output.
          </p>
        </div>

        <div className="bg-gray-100 p-4 rounded-md">
          <h2 className="text-lg font-semibold mb-2">How to use:</h2>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Enter text or a comma-separated byte array in the Original Data field</li>
            <li>Click &quot;Encrypt&quot; to convert it to an encrypted byte array</li>
            <li>Or enter an encrypted byte array in the Encrypted Data field</li>
            <li>Click &quot;Decrypt&quot; to convert it back to the original text</li>
            <li>Optionally, provide a custom encryption key</li>
            <li>Use &quot;Load Test Case&quot; to try with a predefined example</li>
            <li>Use &quot;Reset Key&quot; to restore the default encryption key</li>
            <li>Use &quot;Clear All&quot; to reset all input and output fields</li>
            <li>Use &quot;Remove Quotes&quot; to remove quotes from the input</li>
          </ol>
        </div>
      </div>
    </main>
  )
}
