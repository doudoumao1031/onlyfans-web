import { useEffect, useRef, useState } from "react"
import { buildImageUrl, buildVideoUrl } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"

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

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

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
      if (video) {
        video.pause()
      }
    }
  }, [])
  // 同步播放状态
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
    <div className="relative w-full rounded-xl aspect-square" >
      {isLoading &&
        (thumbId ? (
          <Image
            src={buildImageUrl(thumbId)}
            alt="Video thumbnail"
            className="absolute inset-0 w-full h-full object-cover rounded-xl"
            width={343}
            height={200}
          />
        ) : (
          <Skeleton className="absolute w-full h-full rounded-xl" />
        ))}
      <div className="w-full h-full relative overflow-hidden">
        <video
          ref={backgroundVideoRef}
          src={buildVideoUrl(fileId, "240p")}
          className="w-full h-full absolute top-0 left-0 z-[-1] object-cover blur-[10px]"
          muted
          loop
        />
        <video
          ref={videoRef}
          className="w-full h-full object-contain rounded-xl"
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
    </div >
  )
}
