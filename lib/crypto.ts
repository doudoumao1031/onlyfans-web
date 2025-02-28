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
    entData[i] = d
  }

  // Create decryption mapping (inverse of encryption)
  for (let i = 0; i < 256; i++) {
    decData[entData[i]] = i
  }
}

function simpleEncrypt(src: Uint8Array): Uint8Array {
  const result = new Uint8Array(src.length)
  for (let i = 0; i < src.length; i++) {
    result[i] = entData[src[i]]
  }
  return result
}

function simpleDecrypt(src: Uint8Array): Uint8Array {
  const result = new Uint8Array(src.length)
  for (let i = 0; i < src.length; i++) {
    result[i] = decData[src[i]]
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