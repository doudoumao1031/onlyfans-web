"use client"
import React, { useEffect, useRef } from "react"
import videojs from "video.js"
import "video.js/dist/video-js.css"

export default function VideoPlayer({ src }: { src: string }) {
  const videoOptions = {
    autoplay: true,
    controls: true,
    // poster: "",
    responsive: true,
    loadingSpinner: true,
    bigPlayButton: true,
    sources: [
      {
        src: src,
        type: "video/mp4"
      }
    ]
  }
  const videoRef = useRef<HTMLVideoElement>(null)
  useEffect(() => {
    // 确保 videoRef.current 存在
    if (!videoRef.current) return
    // 初始化 Video.js 播放器
    videojs(videoRef.current, videoOptions, () => {
      console.log("播放器已初始化")
    })
  }, [videoOptions])

  return (
    <div data-vjs-player>
      <video ref={videoRef} className="w-full max-h-[100vh] object-contain video-js vjs-big-play-centered" />
    </div>
  )
}
