"use client"

import { useEffect, useRef, useState } from "react"

import Hls from "hls.js"

export default function VideoPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const [hlsUrl, setHlsUrl] = useState("https://onlyfansstaticdata-test.potato.im/output/original.m3u8")
  const [inputUrl, setInputUrl] = useState("https://onlyfansstaticdata-test.potato.im/output/original.m3u8")

  useEffect(() => {
    const loadVideo = async () => {
      try {
        setIsLoading(true)
        setError(null)

        const video = videoRef.current
        if (!video) return

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
  }, [hlsUrl])

  const handlePlayClick = () => {
    if (videoRef.current) {
      videoRef.current.play().catch(e => {
        console.error("Error on manual play:", e)
        setError("Failed to play video: " + e.message)
      })
      setAutoplayBlocked(false)
    }
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setHlsUrl(inputUrl)
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-lg">
        <h1 className="bg-gray-800 p-4 text-2xl font-bold text-white">HLS Video Player with Encryption</h1>

        <div className="relative aspect-video bg-black">
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="size-12 animate-spin rounded-full border-y-2 border-blue-500"></div>
            </div>
          )}

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
              <div className="p-4 text-center text-white">
                <p className="font-semibold text-red-400">{error}</p>
                <button
                  className="mt-4 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                  onClick={() => window.location.reload()}
                >
                  Retry
                </button>
              </div>
            </div>
          )}

          {autoplayBlocked && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30" onClick={handlePlayClick}>
              {/* Removed the title and button, clicking anywhere on the overlay will play the video */}
            </div>
          )}

          <video
            ref={videoRef}
            className="size-full"
            controls
            playsInline
          />
        </div>

        <div className="p-4">
          <form onSubmit={handleUrlSubmit} className="mb-4">
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="grow">
                <label htmlFor="hlsUrlInput" className="mb-1 block text-sm font-medium text-gray-700">
                  HLS Stream URL
                </label>
                <input
                  id="hlsUrlInput"
                  type="text"
                  value={inputUrl}
                  onChange={(e) => setInputUrl(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Enter HLS stream URL"
                />
              </div>
              <div className="self-end">
                <button
                  type="submit"
                  className="w-full rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 md:w-auto"
                >
                  Load Stream
                </button>
              </div>
            </div>
          </form>

          <p className="text-gray-700">
            This demo shows an HLS video stream with AES-128 encryption. The encryption key is served
            through a secure API route that reads the key from the public directory.
          </p>
          <p className="mt-2 text-gray-700">
            Key location: <code>/public/keys/encrypt.key</code>
          </p>
          <p className="mt-2 text-gray-700">
            Current HLS Source: <code>{hlsUrl}</code>
          </p>
        </div>
      </div>
    </div>
  )
}
