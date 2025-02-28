// eslint-disable-next-line @typescript-eslint/no-require-imports
const { simpleEncrypt, simpleDecrypt, simpleEncryptAll, simpleDecryptAll, setKey } = require("../lib/crypto.cjs.js")

// Test case: Original data
const originalData = new Uint8Array([100, 100, 115, 230, 152, 175, 229, 156, 176, 230, 150, 185, 231, 172, 172, 228, 184, 137, 230, 150, 185, 228, 189, 134, 230, 152, 175, 230, 150, 185, 229, 188, 143, 229, 156, 176, 230, 150, 185, 231, 154, 132, 232, 140, 131, 229, 190, 183, 232, 144, 168, 232, 140, 131, 229, 190, 183, 232, 144, 168, 231, 154, 132, 229, 156, 176, 230, 150, 185, 231, 154, 132, 230, 152, 175, 229, 144, 166, 230, 150, 185, 230, 179, 149, 229, 156, 176, 230, 150, 185, 231, 154, 132, 229, 143, 141, 229, 175, 185, 229, 143, 141, 229, 175, 185])

// Expected encrypted data
const expectedEncryptedData = new Uint8Array([15, 15, 24, 141, 243, 196, 142, 247, 219, 141, 253, 210, 140, 199, 199, 143, 211, 226, 141, 253, 210, 143, 214, 237, 141, 243, 196, 141, 253, 210, 142, 215, 228, 142, 247, 219, 141, 253, 210, 140, 241, 239, 131, 231, 232, 142, 213, 220, 131, 251, 195, 131, 231, 232, 142, 213, 220, 131, 251, 195, 140, 241, 239, 142, 247, 219, 141, 253, 210, 140, 241, 239, 141, 243, 196, 142, 251, 205, 141, 253, 210, 141, 216, 254, 142, 247, 219, 141, 253, 210, 140, 241, 239, 142, 228, 230, 142, 196, 210, 142, 228, 230, 142, 196, 210])

// Test simpleEncrypt
console.log("Testing simpleEncrypt...")
const encryptedData = simpleEncrypt(originalData)
console.log("Encrypted data:", Array.from(encryptedData))

// Verify encryption
let encryptionCorrect = true
for (let i = 0; i < encryptedData.length; i++) {
  if (encryptedData[i] !== expectedEncryptedData[i]) {
    console.error(`Encryption mismatch at index ${i}: expected ${expectedEncryptedData[i]}, got ${encryptedData[i]}`)
    encryptionCorrect = false
  }
}
console.log("Encryption test:", encryptionCorrect ? "PASSED" : "FAILED")

// Test simpleDecrypt
console.log("\nTesting simpleDecrypt...")
const decryptedData = simpleDecrypt(encryptedData)
console.log("Decrypted data:", Array.from(decryptedData))

// Verify decryption
let decryptionCorrect = true
for (let i = 0; i < decryptedData.length; i++) {
  if (decryptedData[i] !== originalData[i]) {
    console.error(`Decryption mismatch at index ${i}: expected ${originalData[i]}, got ${decryptedData[i]}`)
    decryptionCorrect = false
  }
}
console.log("Decryption test:", decryptionCorrect ? "PASSED" : "FAILED")

// Test simpleEncryptAll and simpleDecryptAll
console.log("\nTesting simpleEncryptAll and simpleDecryptAll...")
const encryptedAllData = simpleEncryptAll(originalData)
const decryptedAllData = simpleDecryptAll(encryptedAllData)

// Verify encryptAll/decryptAll
let encryptAllDecryptAllCorrect = true
for (let i = 0; i < decryptedAllData.length; i++) {
  if (decryptedAllData[i] !== originalData[i]) {
    console.error(`EncryptAll/DecryptAll mismatch at index ${i}: expected ${originalData[i]}, got ${decryptedAllData[i]}`)
    encryptAllDecryptAllCorrect = false
  }
}
console.log("EncryptAll/DecryptAll test:", encryptAllDecryptAllCorrect ? "PASSED" : "FAILED")

// Test setKey with a custom key
console.log("\nTesting setKey with a custom key...")
const customKey = "TestKey123!@#"
setKey(customKey)

// Test with the new key
const encryptedWithCustomKey = simpleEncrypt(originalData)
const decryptedWithCustomKey = simpleDecrypt(encryptedWithCustomKey)

// Verify custom key encryption/decryption
let customKeyCorrect = true
for (let i = 0; i < decryptedWithCustomKey.length; i++) {
  if (decryptedWithCustomKey[i] !== originalData[i]) {
    console.error(`Custom key mismatch at index ${i}: expected ${originalData[i]}, got ${decryptedWithCustomKey[i]}`)
    customKeyCorrect = false
  }
}
console.log("Custom key test:", customKeyCorrect ? "PASSED" : "FAILED")

// Print the original text (if it's UTF-8 encoded text)
try {
  console.log("\nOriginal text:", new TextDecoder().decode(originalData))
} catch (e) {
  console.log("Could not decode original data as UTF-8 text")
}

console.log("\nAll tests completed.")
