const simpleK21 = "simple_key_as"
let simpleKey = "s!*K@wl.zeo&{"
const entData = new Uint8Array(256)
const decData = new Uint8Array(256)

function simpleDecryptAll(src: Uint8Array): Uint8Array {
  const result = new Uint8Array(src.length)
  for (let i = 0; i < src.length; i++) {
    let byte = src[i]
    for (let j = 0; j < simpleKey.length; j++) {
      byte ^= simpleKey.charCodeAt(j)
    }
    result[i] = byte
  }
  return result
}

function simpleEncryptAll(src: Uint8Array): Uint8Array {
  return simpleDecryptAll(src)
}

function setKey(key: string): void {
  if (key) {
    simpleKey = key
    createKey()
  }
}

function createKey(): void {
  // Create encryption mapping
  for (let i = 0; i < 256; i++) {
    let d = i
    for (let j = 0; j < simpleKey.length; j++) {
      d ^= simpleKey.charCodeAt(j)
    }
    // Ensure the result is within valid range (0-255)
    entData[i] = d & 0xFF
  }

  // Create decryption mapping (inverse of encryption)
  for (let i = 0; i < 256; i++) {
    const encryptedValue = entData[i]
    decData[encryptedValue] = i
  }

  // Verify the mappings are complete
  for (let i = 0; i < 256; i++) {
    // Check if every possible byte value has a mapping
    if (decData[i] === undefined) {
      console.warn(`Warning: No decryption mapping for byte value ${i}`)
      // Provide a fallback mapping to prevent data loss
      decData[i] = i
    }
  }
}

function simpleEncrypt(src: Uint8Array): Uint8Array {
  const result = new Uint8Array(src.length)
  for (let i = 0; i < src.length; i++) {
    // Ensure the byte value is within valid range (0-255)
    const byteValue = src[i] & 0xFF
    result[i] = entData[byteValue]
  }
  return result
}

function simpleDecrypt(src: Uint8Array): Uint8Array {
  const result = new Uint8Array(src.length)
  for (let i = 0; i < src.length; i++) {
    // Ensure the byte value is within valid range (0-255)
    const byteValue = src[i] & 0xFF
    result[i] = decData[byteValue]
  }
  return result
}

// Initialize key on load
createKey()

// Export functions for ES modules
export {
  simpleEncrypt,
  simpleDecrypt,
  simpleEncryptAll,
  simpleDecryptAll,
  setKey
}