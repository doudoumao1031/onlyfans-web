import { useEffect, useRef, useState } from "react"
import { buildImageUrl, buildVideoUrl } from "@/lib/utils"
import { Skeleton } from "@/components/ui/skeleton"

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
      observer.unobserve(video)
    }
  }, [])

  return (
    <div className="relative w-full rounded-xl" style={{ aspectRatio: "343/200" }}>
      {isLoading && (
        <Skeleton className="absolute inset-0 w-full h-full rounded-xl" />
      )}
      <video
        ref={videoRef}
        className="w-full h-full object-cover rounded-xl"
        poster={buildImageUrl(thumbId || fileId)}
        src={buildVideoUrl(fileId, "240p")}
        playsInline
        muted
        loop
        onLoadedData={() => setIsLoading(false)}
      />
    </div>
  )
}
