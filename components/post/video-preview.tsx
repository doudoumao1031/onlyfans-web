import { useEffect, useRef, useState } from "react"

import Image from "next/image"

import { Skeleton } from "@/components/ui/skeleton"
import { buildImageUrl, buildVideoUrl } from "@/lib/utils"

// Keep track of currently playing video
let currentlyPlaying: HTMLVideoElement | null = null

interface VideoPreviewProps {
  fileId: string
  thumbId?: string
}

export function VideoPreview({ fileId, thumbId }: VideoPreviewProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const backgroundVideoRef = useRef<HTMLVideoElement>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isVertical, setIsVertical] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setIsVertical(video.videoHeight > video.videoWidth)
    }

    video.addEventListener("loadedmetadata", handleLoadedMetadata)

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch((error) => {
              console.log("Autoplay prevented", error)
            })
          } else {
            video.pause()
          }
        })
      },
      {
        threshold: 0.9
      }
    )

    observer.observe(video)

    return () => {
      if (currentlyPlaying === video) {
        currentlyPlaying = null
      }
      observer.unobserve(video)
      video.removeEventListener("loadedmetadata", handleLoadedMetadata)
      video.pause()
    }
  }, [])

  const handlePlay = () => {
    if (backgroundVideoRef.current && videoRef.current) {
      backgroundVideoRef.current.play()
    }
  }

  const handlePause = () => {
    if (backgroundVideoRef.current && videoRef.current) {
      backgroundVideoRef.current.pause()
    }
  }

  return (
    <div className={`relative ${isVertical&&"aspect-square"} w-full rounded-xl `}>
      {isLoading &&
        (thumbId ? (
          <Image
            src={buildImageUrl(thumbId)}
            alt="Video thumbnail"
            className="absolute inset-0 size-full rounded-xl object-cover"
            width={343}
            height={200}
          />
        ) : (
          <Skeleton className="absolute size-full rounded-xl" />
        ))}
      <div className="relative size-full overflow-hidden">
        {isVertical && (
          <video
            ref={backgroundVideoRef}
            src={buildVideoUrl(fileId, "240p")}
            className="absolute left-0 top-0 z-[-1] size-full object-cover blur-[10px]"
            muted
            loop
          />
        )}
        <video
          ref={videoRef}
          className="size-full object-contain"
          poster={buildImageUrl(thumbId || fileId)}
          src={buildVideoUrl(fileId, "240p")}
          playsInline
          onPlay={handlePlay}
          onPause={handlePause}
          muted
          loop
          onCanPlay={() => setIsLoading(false)}
        />
      </div>
    </div>
  )
}