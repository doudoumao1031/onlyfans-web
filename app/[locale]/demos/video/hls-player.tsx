// components/HLSPlayer.tsx
"use client"
import { useEffect, useRef } from "react"

import Hls from "hls.js"

interface HLSPlayerProps {
  src: string;
  encryptionKeyUrl: string;
}

const HLSPlayer = ({ src, encryptionKeyUrl }: HLSPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    let hls: Hls

    if (Hls.isSupported()) {
      hls = new Hls({
        // 配置加密密钥
        emeEnabled: true,
        widevineLicenseUrl: "" // 如果需要 Widevine DRM 可以配置
      })

      hls.loadSource(src)
      hls.attachMedia(video)

      // 设置加密密钥
      hls.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
        const keySystems = {
          "org.w3.clearkey": {
            videoContentType: "video/mp4",
            // 这里可以设置你的加密密钥
            // 实际应用中应该从安全的地方获取
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            getLicense: (emeOptions: any, keyMessage: any, callback: (arg0: null, arg1: ArrayBuffer | undefined) => void) => {
              fetch(encryptionKeyUrl)
                .then(response => response.arrayBuffer())
                .then(key => {
                  callback(null, key)
                })
                .catch(error => {
                  callback(null,error)
                })
            }
          }
        }

        if (video.mediaKeys) {
          // hls.emeController.setMediaKeys(video, keySystems)
        }
      })

      // eslint-disable-next-line import/no-named-as-default-member
      hls.on(Hls.Events.ERROR, (event, data) => {
        if (data.fatal) {
          switch (data.type) {
            // eslint-disable-next-line import/no-named-as-default-member
            case Hls.ErrorTypes.NETWORK_ERROR:
              console.error("Fatal network error encountered, try to recover")
              hls.startLoad()
              break
            // eslint-disable-next-line import/no-named-as-default-member
            case Hls.ErrorTypes.MEDIA_ERROR:
              console.error("Fatal media error encountered, try to recover")
              hls.recoverMediaError()
              break
            default:
              // 无法恢复
              hls.destroy()
              break
          }
        }
      })
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      // 原生 HLS 支持 (Safari)
      video.src = src
    }

    return () => {
      if (hls) {
        hls.destroy()
      }
    }
  }, [src, encryptionKeyUrl])

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      style={{ width: "100%" }}
    />
  )
}

export default HLSPlayer