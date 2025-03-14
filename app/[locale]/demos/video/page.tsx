"use client"

import { useEffect, useRef, useState } from "react"
import Hls from "hls.js"

export default function VideoPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const video = videoRef.current
        if (!video) return

        // The CDN URL for the HLS playlist
        const hlsUrl = "https://onlyfansstaticdata-test.potato.im/output/original.m3u8"

        // Check if HLS is supported
        if (Hls.isSupported()) {
          const hls = new Hls({
            xhrSetup: function(xhr) {
              // Add CORS headers if needed
              xhr.withCredentials = false
            }
          })

          // Load the manifest from CDN
          hls.loadSource(hlsUrl)

          // Bind hls to video element
          hls.attachMedia(video)

          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            setIsLoading(false)
            // Try to play but don't throw error - handle it gracefully
            video.play().catch(e => {
              console.error("Error playing video:", e)
              if (e.name === "NotAllowedError") {
                // This is expected if user hasn't interacted with the page
                setAutoplayBlocked(true)
              } else {
                setError("Failed to play video: " + e.message)
              }
            })
          })

          hls.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.error("Network error:", data)
                  setError("Network error: Please check your connection and try again.")
                  hls.startLoad()
                  break
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.error("Media error:", data)
                  setError("Media error: Please try refreshing the page.")
                  hls.recoverMediaError()
                  break
                default:
                  console.error("Fatal error:", data)
                  setError("Fatal error: Please try refreshing the page.")
                  hls.destroy()
                  break
              }
            }
          })

          // Clean up
          return () => {
            hls.destroy()
          }
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          // For Safari
          video.src = hlsUrl
          video.addEventListener("loadedmetadata", () => {
            setIsLoading(false)
            video.play().catch(e => {
              console.error("Error playing video:", e)
              if (e.name === "NotAllowedError") {
                // This is expected if user hasn't interacted with the page
                setAutoplayBlocked(true)
              } else {
                setError("Failed to play video: " + e.message)
              }
            })
          })
        } else {
          setError("Your browser does not support HLS playback.")
        }
      } catch (err) {
        console.error("Error setting up video:", err)
        setError("Failed to load video player. Please try again later.")
        setIsLoading(false)
      }
    }

    loadVideo()
  }, [])

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => {
        console.error("Error on manual play:", e)
        setError("Failed to play video: " + e.message)
      })
      setAutoplayBlocked(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4 bg-gray-100">
      <div className="w-full max-w-4xl bg-white rounded-lg shadow-lg overflow-hidden">
        <h1 className="text-2xl font-bold p-4 bg-gray-800 text-white">HLS Video Player with Encryption</h1>

        <div className="relative aspect-video bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
              <div className="text-white text-center p-4">
                <p className="text-red-400 font-semibold">{error}</p>
                <button
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {autoplayBlocked && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="text-white text-center p-4">
                <p className="font-semibold">Click to play the video</p>
                <button
                  className="mt-4 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 flex items-center justify-center"
                  onClick={handlePlayClick}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="ml-2">Play Video</span>
                </button>
              </div>
            </div>
          )}

          <video
            ref={videoRef}
            className="w-full h-full"
            controls
            playsInline
          />
        </div>

        <div className="p-4">
          <p className="text-gray-700">
            This demo shows an HLS video stream with AES-128 encryption. The encryption key is served
            through a secure API route that reads the key from the public directory.
          </p>
          <p className="text-gray-700 mt-2">
            Key location: <code>/public/keys/encrypt.key</code>
          </p>
          <p className="text-gray-700 mt-2">
            HLS Source: <code>https://onlyfansstaticdata-test.potato.im/output/original.m3u8</code>
          </p>
        </div>
      </div>
    </div>
  )
}
