"use client"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface VideoPlayerProps {
  sources: {
    quality: string
    url: string
  }[]
  className?: string
}

export function VideoPlayer({ sources, className }: VideoPlayerProps) {
  const [currentQuality, setCurrentQuality] = useState<string>(sources[0]?.quality || "1080p")
  const [showQualityMenu, setShowQualityMenu] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  const currentSource = sources.find(s => s.quality === currentQuality)?.url || sources[0]?.url

  // Save current playback position when changing quality
  const handleQualityChange = (quality: string) => {
    if (videoRef.current) {
      const currentTime = videoRef.current.currentTime
      const isPlaying = !videoRef.current.paused
      setCurrentQuality(quality)

      // After source changes, restore playback position and state
      videoRef.current.addEventListener("loadeddata", () => {
        if (videoRef.current) {
          videoRef.current.currentTime = currentTime
          if (isPlaying) {
            videoRef.current.play()
          }
        }
      }, { once: true })
    }
    setShowQualityMenu(false)
  }

  return (
    <div className="relative group">
      <video
        ref={videoRef}
        src={currentSource}
        className={cn("w-full", className)}
        controls
        preload="metadata"
      />

      <div className="absolute bottom-14 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="relative">
          <button
            onClick={() => setShowQualityMenu(!showQualityMenu)}
            className="bg-black/70 text-white px-2 py-1 rounded hover:bg-black/80"
          >
            {currentQuality}
          </button>

          {showQualityMenu && (
            <div className="absolute bottom-full right-0 mb-1 bg-black/70 rounded overflow-hidden">
              {sources.map((source) => (
                <button
                  key={source.quality}
                  onClick={() => handleQualityChange(source.quality)}
                  className={cn(
                    "block w-full px-4 py-2 text-white text-left hover:bg-white/10",
                    currentQuality === source.quality && "bg-white/20"
                  )}
                >
                  {source.quality}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
