"use client"

import { useEffect, useRef } from "react"

import videojs from "video.js"
import Player from "video.js/dist/types/player"
import "video.js/dist/video-js.css"
// eslint-disable-next-line import/no-unresolved
import "videojs-resolution-switcher-v8"

import "./video-play.scss"

interface VideoPlayerProps {
  sources: { src: string; type: string; label: string }[]; // 视频源
}

type TPlayer = Player&{currentResolution:()=>{label:string}} | undefined
export default function VideoPlayer({ sources }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const playerRef = useRef<TPlayer>(null)

  useEffect(() => {
    if (videoRef.current&&!playerRef.current) {
      videojs(videoRef.current, {
      autoplay: true,
      controls: true,
      // poster: "",
      responsive: true,
      loadingSpinner: true,
      bigPlayButton: true,
        plugins: {
          videoJsResolutionSwitcher: {
            default: 1080, // 默认分辨率
            dynamicLabel: true // 显示动态分辨率按钮
          }
        },
        sources: sources // 设置多个视频源
      },() => {
        playerRef.current = videojs.getPlayer("video-id") as TPlayer
        if (playerRef.current) {
          // 初始化分辨率切换插件
        playerRef.current.on("resolutionchange", function () {
          console.log("分辨率已切换到:",playerRef.current, playerRef.current?.currentSrc())
          const labelEl = document.querySelector(".vjs-resolution-button-label")
          if (labelEl&&playerRef.current) {
            labelEl.textContent = playerRef.current.currentResolution().label|| "清晰度"
          }
        })
        playerRef.current.on("error", () => console.log("播放出错",  playerRef.current?.error()))

        }
      })
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.dispose()
        playerRef.current = null
      }
    }
  }, [sources])

  return (
    <div>
      <video  id="video-id" ref={videoRef} className="video-js vjs-default-skin max-h-screen w-full object-contain" controls />
    </div>
  )
}
