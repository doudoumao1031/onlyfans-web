"use client"

import { useEffect, useRef, useCallback, useState } from "react"

import * as cryptoModule from "@/lib/crypto"

export default function VideoCryptoPage() {
  const ENCRYPTION_KEY = "s!*K@wl.zeo&{"
  const videoRef = useRef<HTMLVideoElement>(null)
  const mediaSourceRef = useRef<MediaSource | null>(null)
  const sourceBufferRef = useRef<SourceBuffer | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [customUrl, setCustomUrl] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [progressStats, setProgressStats] = useState<{
    bytesLoaded: number;
    totalBytes: number;
    percentComplete: number;
  }>({ bytesLoaded: 0, totalBytes: 0, percentComplete: 0 })

  // Initialize crypto module with the key
  useEffect(() => {
    try {
      cryptoModule.setKey(ENCRYPTION_KEY)
    } catch (err) {
      console.error("Failed to initialize crypto module:", err)
    }
  }, [])

  const setupMediaSource = useCallback((): string => {
    // Create a new MediaSource instance
    const mediaSource = new MediaSource()
    mediaSourceRef.current = mediaSource

    // Create a URL for the video element
    const url = URL.createObjectURL(mediaSource)

    // Set up the source buffer when the MediaSource is opened
    mediaSource.addEventListener("sourceopen", () => {
      try {
        // Create a source buffer for MP4 content
        const sourceBuffer = mediaSource.addSourceBuffer("video/mp4; codecs=\"avc1.42E01E, mp4a.40.2\"")
        sourceBufferRef.current = sourceBuffer

        // Handle source buffer updates
        sourceBuffer.addEventListener("updateend", () => {
          // If we have more data queued and the source buffer is not updating, append it
          if (mediaSource.readyState === "open" && !sourceBuffer.updating) {
            // This is where we would append more data if needed
          }
        })
      } catch (error) {
        console.error("Error setting up source buffer:", error)
      }
    })

    return url
  }, [])

  const fetchAndPlayProgressively = useCallback(async (url: string) => {
    setIsLoading(true)
    setProgressStats({ bytesLoaded: 0, totalBytes: 0, percentComplete: 0 })

    try {
      // Set up the MediaSource and get the URL
      const videoUrl = setupMediaSource()

      // Set the video source to the MediaSource URL
      if (videoRef.current) {
        videoRef.current.src = videoUrl
      }

      // Fetch the video
      const response = await fetch(url)

      // Get the total size if available
      const totalBytes = Number(response.headers.get("content-length")) || 0

      if (!response.body) {
        throw new Error("Response body is null")
      }

      const reader = response.body.getReader()
      let bytesLoaded = 0
      let chunks: Uint8Array[] = []
      let chunkSize = 0

      // Read the stream
      const processStream = async () => {
        while (true) {
          const { done, value } = await reader.read()

          if (done) {
            // End of stream, close the MediaSource if it's still open
            if (mediaSourceRef.current && mediaSourceRef.current.readyState === "open") {
              mediaSourceRef.current.endOfStream()
            }
            break
          }

          // Decrypt the chunk
          const decryptedChunk = cryptoModule.simpleDecrypt(value)
          bytesLoaded += value.length

          // Update progress stats
          setProgressStats({
            bytesLoaded,
            totalBytes,
            percentComplete: totalBytes ? Math.round((bytesLoaded / totalBytes) * 100) : 0
          })

          // Add the chunk to our buffer
          chunks.push(decryptedChunk)
          chunkSize += decryptedChunk.length

          // If we have enough data or the source buffer is ready, append it
          if (sourceBufferRef.current && !sourceBufferRef.current.updating &&
              mediaSourceRef.current && mediaSourceRef.current.readyState === "open" &&
              (chunkSize > 1024 * 1024 || chunks.length > 10)) {

            // Combine all chunks into one buffer
            const combinedChunk = new Uint8Array(chunkSize)
            let offset = 0
            for (const chunk of chunks) {
              combinedChunk.set(chunk, offset)
              offset += chunk.length
            }

            // Append the combined chunk to the source buffer
            try {
              sourceBufferRef.current.appendBuffer(combinedChunk)
              // Clear the chunks array and reset chunk size
              chunks = []
              chunkSize = 0
            } catch (error) {
              console.error("Error appending buffer:", error)
            }
          }
        }
      }

      // Start processing the stream
      await processStream()
      setIsLoading(false)
    } catch (error) {
      console.error("Error loading video:", error)
      setIsLoading(false)
    }
  }, [setupMediaSource])

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true)

      // Create a URL for the file
      const fileUrl = URL.createObjectURL(file)

      // Use the progressive playback method for the file
      await fetchAndPlayProgressively(fileUrl)
    } catch (error) {
      console.error("Error processing file:", error)
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

      // Load the video from the URL with progressive playback
      fetchAndPlayProgressively(customUrl)
    }
  }

  useEffect(() => {
    // Cleanup function to release resources
    return () => {
      if (videoRef.current) {
        videoRef.current.src = ""
      }
      if (mediaSourceRef.current && mediaSourceRef.current.readyState === "open") {
        mediaSourceRef.current.endOfStream()
      }
    }
  }, [])

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-4 text-2xl font-bold">Encrypted Video Player</h1>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">
          Encrypted Video URL:
          <div className="mt-2 flex">
            <input
              type="text"
              value={customUrl}
              onChange={handleUrlChange}
              className="grow rounded-l-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Enter URL to encrypted video"
            />
            <button
              onClick={handleLoadUrl}
              disabled={isLoading}
              className="rounded-r-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading ? "Loading..." : "Load"}
            </button>
          </div>
        </label>
      </div>

      <div className="mb-4">
        <label className="mb-2 block text-sm font-medium">
          Upload encrypted MP4 file:
          <input
            type="file"
            accept="video/mp4,video/*"
            onChange={handleFileChange}
            className="mt-2 block w-full text-sm text-gray-500
              file:mr-4 file:rounded-md file:border-0
              file:bg-blue-50 file:px-4
              file:py-2 file:text-sm
              file:font-semibold file:text-blue-700
              hover:file:bg-blue-100"
          />
        </label>
        {selectedFile && (
          <p className="mt-1 text-sm text-gray-500">
            Selected file: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
          </p>
        )}
      </div>

      {isLoading && (
        <div className="mb-4">
          <div className="h-2.5 w-full rounded-full bg-gray-200">
            <div
              className="h-2.5 rounded-full bg-blue-600"
              style={{ width: `${progressStats.percentComplete}%` }}
            ></div>
          </div>
          <p className="mt-1 text-sm text-gray-600">
            {progressStats.bytesLoaded.toLocaleString()} / {progressStats.totalBytes.toLocaleString()} bytes
            ({progressStats.percentComplete}%)
          </p>
        </div>
      )}

      <div className="video-container">
        <video
          ref={videoRef}
          className="mx-auto w-full max-w-3xl border border-gray-300"
          controls
          width="640"
          height="360"
        />
      </div>
    </div>
  )
}