"use client"

import { useEffect, useRef, useCallback, useState } from "react"
import * as cryptoModule from "@/lib/crypto"

export default function VideoCryptoPage() {
  const ENCRYPTION_KEY = "s!*K@wl.zeo&{"
  const videoRef = useRef<HTMLVideoElement>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [customUrl, setCustomUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)

  // Initialize crypto module with the key
  useEffect(() => {
    try {
      cryptoModule.setKey(ENCRYPTION_KEY)
    } catch (err) {
      console.error("Failed to initialize crypto module:", err)
    }
  }, [])

  const fetchDecryptedVideo = useCallback(async (url: string): Promise<Blob> => {
    setIsLoading(true)
    try {
      const response = await fetch(url)

      if (!response.body) {
        throw new Error("Response body is null")
      }

      const reader = response.body.getReader()

      const stream = new ReadableStream({
        start(controller) {
          function read() {
            reader.read().then(({ done, value }) => {
              if (done) {
                controller.close()
                return
              }
              // Use the cryptoModule.simpleDecrypt function instead of custom implementation
              const decryptedChunk = cryptoModule.simpleDecrypt(value)
              controller.enqueue(decryptedChunk)
              read()
            })
          }
          read()
        }
      })

      const response2 = new Response(stream, { headers: { "Content-Type": "video/mp4" } })
      return response2.blob()
    } finally {
      setIsLoading(false)
    }
  }, [])

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true)
      // Read the file as an ArrayBuffer
      const arrayBuffer = await file.arrayBuffer()

      // Convert to Uint8Array for decryption
      const encryptedData = new Uint8Array(arrayBuffer)

      // Use the cryptoModule.simpleDecrypt function instead of custom implementation
      const decryptedData = cryptoModule.simpleDecrypt(encryptedData)

      // Create a blob from the decrypted data
      const blob = new Blob([decryptedData], { type: "video/mp4" })

      // Create a URL for the blob
      const videoUrl = URL.createObjectURL(blob)

      // Set the video source
      if (videoRef.current) {
        videoRef.current.src = videoUrl
      }
    } catch (error) {
      console.error("Error processing file:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      setSelectedFile(files[0])
      handleFileUpload(files[0])
    }
  }

  const handleUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCustomUrl(event.target.value)
  }

  const handleLoadUrl = () => {
    // /crypto/encrypted_068 (1).mp4
    // https://onlyfansstaticdata-test.potato.im/video/encrypted_068.mp4
    if (customUrl) {
      // Clear any selected file
      setSelectedFile(null)

      // Load the video from the URL
      fetchDecryptedVideo(customUrl)
        .then(blob => {
          const decryptedUrl = URL.createObjectURL(blob)
          if (videoRef.current) {
            videoRef.current.src = decryptedUrl
          }
        })
        .catch(error => {
          console.error("Error loading encrypted video:", error)
        })
    }
  }

  useEffect(() => {
    // Only fetch from URL if no file is selected
    if (!selectedFile && customUrl) {
      fetchDecryptedVideo(customUrl)
        .then(blob => {
          const decryptedUrl = URL.createObjectURL(blob)
          if (videoRef.current) {
            videoRef.current.src = decryptedUrl
          }
        })
        .catch(error => {
          console.error("Error loading encrypted video:", error)
        })
    }
  }, [fetchDecryptedVideo, selectedFile, customUrl])

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Encrypted Video Player</h1>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Encrypted Video URL:
          <div className="flex mt-2">
            <input
              type="text"
              value={customUrl}
              onChange={handleUrlChange}
              className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter URL to encrypted video"
            />
            <button
              onClick={handleLoadUrl}
              disabled={isLoading}
              className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Load"}
            </button>
          </div>
        </label>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">
          Upload encrypted MP4 file:
          <input
            type="file"
            accept="video/mp4,video/*"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-md file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </label>
        {selectedFile && (
          <p className="mt-1 text-sm text-gray-500">
            Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
          </p>
        )}
      </div>

      <div className="video-container">
        <video
          ref={videoRef}
          className="w-full max-w-3xl mx-auto border border-gray-300"
          controls
          width="640"
          height="360"
        />
      </div>
    </div>
  )
}