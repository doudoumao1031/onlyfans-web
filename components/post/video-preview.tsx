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
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            video.play().catch(() => {
              console.log("Autoplay prevented")
            })
          } else {
            video.pause()
          }
        })
      },
      {
        threshold: 0.5
      }
    )

    observer.observe(video)

    return () => {
      if (currentlyPlaying === video) {
        currentlyPlaying = null
      }
      observer.unobserve(video)
    }
  }, [])

  return (
    <div className="relative w-full rounded-xl" style={{ aspectRatio: "343/200" }}>
      {isLoading && (
        thumbId ? (
          <Image
            src={buildImageUrl(thumbId)}
            alt="Video thumbnail"
            className="absolute inset-0 w-full h-full object-cover rounded-xl"
            width={343}
            height={200}
          />
        ) : (
          <Skeleton className="absolute inset-0 w-full h-full rounded-xl bg-gray-400 opacity-10" />
        )
      )}
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-xl"
        poster={buildImageUrl(thumbId || fileId)}
        src={buildVideoUrl(fileId, "240p")}
        playsInline
        muted
        loop
        onCanPlay={() => setIsLoading(false)}
      />
    </div>
  )
}
