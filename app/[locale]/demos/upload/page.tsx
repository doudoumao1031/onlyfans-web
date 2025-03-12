"use client"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

export default function VideoUploadDemo() {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Generate thumbnail from the first frame of the video
  const generateThumbnail = useCallback((file: File) => {
    const videoElement = document.createElement("video")
    videoElement.preload = "metadata"

    videoElement.onloadeddata = () => {
      // Set the current time to the first frame (0.1 seconds to ensure we get a frame)
      videoElement.currentTime = 0.1
    }

    videoElement.onseeked = () => {
      // Create a canvas element to capture the current frame
      const canvas = document.createElement("canvas")
      canvas.width = videoElement.videoWidth
      canvas.height = videoElement.videoHeight

      // Draw the current frame to the canvas
      const ctx = canvas.getContext("2d")
      if (ctx) {
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)

        // Convert the canvas to a data URL and set as preview
        const dataUrl = canvas.toDataURL("image/jpeg")
        setPreviewUrl(dataUrl)
      }
    }

    // Set the video source to the selected file
    videoElement.src = URL.createObjectURL(file)
  }, [])

  // Handle file selection
  const handleFileChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Check if it's a video file
    if (!file.type.startsWith("video/")) {
      alert("Please select a video file")
      return
    }

    setVideoFile(file)
    generateThumbnail(file)
  }, [generateThumbnail])

  // Simulate an upload with progress updates
  const simulateUpload = useCallback(() => {
    return new Promise<void>((resolve) => {
      let progress = 0
      const interval = setInterval(() => {
        progress += 5
        setUploadProgress(progress)

        if (progress >= 100) {
          clearInterval(interval)
          resolve()
        }
      }, 200)
    })
  }, [])

  // Handle file upload
  const handleUpload = useCallback(async () => {
    if (!videoFile) return

    setIsUploading(true)
    setUploadProgress(0)

    // Create a FormData object to send the file
    const formData = new FormData()
    formData.append("video", videoFile)

    try {
      // Simulate upload with progress
      // In a real application, replace this with your actual API call
      await simulateUpload()

      alert("Upload completed successfully!")
    } catch (error) {
      console.error("Upload failed:", error)
      alert("Upload failed. Please try again.")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }, [videoFile, simulateUpload])

  // Trigger file input click
  const handleSelectClick = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  return (
    <div className="container mx-auto py-10">
      <div className="w-full max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold mb-2">Video Upload Demo</h2>
          <p className="text-gray-600">Upload a video file and see the first frame preview</p>
        </div>
        <div className="space-y-6">
          {/* Hidden file input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="video/*"
            className="hidden"
          />

          {/* Upload area */}
          <div
            className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer hover:bg-gray-50 transition-colors"
            onClick={handleSelectClick}
          >
            {previewUrl ? (
              <div className="relative w-full aspect-video mx-auto">
                <Image
                  src={previewUrl}
                  alt="Video preview"
                  fill
                  className="object-contain rounded-md"
                />
              </div>
            ) : (
              <div className="text-gray-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 mx-auto mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <p className="text-lg font-medium">Click to select a video file</p>
                <p className="text-sm mt-2">or drag and drop</p>
              </div>
            )}
          </div>

          {/* File info */}
          {videoFile && (
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="font-medium">Selected file:</p>
              <p className="text-sm text-gray-600">{videoFile.name}</p>
              <p className="text-sm text-gray-600">{(videoFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          )}

          {/* Upload progress */}
          {isUploading && (
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}
              />
              <p className="text-sm text-gray-600 mt-2 text-right">{uploadProgress}%</p>
            </div>
          )}
        </div>
        <div className="mt-6">
          <Button
            onClick={handleUpload}
            disabled={!videoFile || isUploading}
            className="w-full"
          >
            {isUploading ? "Uploading..." : "Upload Video"}
          </Button>
        </div>
      </div>
    </div>
  )
}