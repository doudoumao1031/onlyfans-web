"use client"

import { useEffect, useRef, useState } from "react"

import Hls, { Events } from "hls.js"

import { convertToHLS } from "./actions"

export default function HLSDemo() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [hlsUrl, setHlsUrl] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [_isPlaying, setIsPlaying] = useState(false)
  const [_enableEncryption, _setEnableEncryption] = useState(false)
  const [conversionTime, setConversionTime] = useState<number | null>(null)
  const [resolutions, setResolutions] = useState<Record<string, string>>({})
  const [isEncrypted, setIsEncrypted] = useState(true)
  const [videoDimensions, setVideoDimensions] = useState<{ width: number; height: number } | null>(null)
  const [currentResolution, setCurrentResolution] = useState<string | null>(null)

  const videoRef = useRef<HTMLVideoElement>(null)
  const _formRef = useRef<HTMLFormElement>(null)
  const hlsRef = useRef<Hls | null>(null)

  const handleUpload = async (formData: FormData) => {
    try {
      setIsUploading(true)
      setError(null)
      setUploadProgress(0)

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 95) {
            clearInterval(progressInterval)
            return 95
          }
          return prev + 5
        })
      }, 200)

      const response = await convertToHLS(formData)
      clearInterval(progressInterval)

      if (!response.success) {
        setError(response.error || "转换失败")
        setIsUploading(false)
        return
      }

      setHlsUrl(response.hlsUrl || null)
      setConversionTime(response.conversionTimeMs || null)
      setUploadProgress(100)
      setIsEncrypted(response.encrypted || false)
      setVideoDimensions(response.dimensions || null)

      // Set available resolutions
      if (response.resolutions && Object.keys(response.resolutions).length > 0) {
        setResolutions(response.resolutions)
        setCurrentResolution(Object.keys(response.resolutions)[0]) // Set default resolution
      }
    } catch (err) {
      console.error("上传错误:", err)
      setError("上传或转换过程中出错")
    } finally {
      setIsUploading(false)
    }
  }

  useEffect(() => {
    if (!hlsUrl || !videoRef.current) return

    // Clean up previous HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }

    if (Hls.isSupported()) {
      const hls = new Hls({
        capLevelToPlayerSize: true, // Enable adaptive quality based on player size
        startLevel: -1 // Auto select initial level
      })
      hlsRef.current = hls

      // Load the HLS stream
      hls.loadSource(hlsUrl)
      hls.attachMedia(videoRef.current)

      // Handle resolution switching
      hls.on(Events.MANIFEST_PARSED, () => {
        const availableLevels = hls.levels.map((level, index) => ({
          index,
          width: level.width,
          height: level.height,
          bitrate: level.bitrate
        }))

        console.log("Available HLS levels:", availableLevels)

        // Set initial resolution if specified
        if (currentResolution) {
          const levelIndex = getLevelIndexForResolution(hls, currentResolution)
          if (levelIndex !== -1) {
            hls.currentLevel = levelIndex
          }
        }
      })

      videoRef.current.play().catch(e => console.error("Error auto-playing video:", e))
    } else if (videoRef.current.canPlayType("application/vnd.apple.mpegurl")) {
      // For Safari
      videoRef.current.src = hlsUrl
      videoRef.current.play().catch(e => console.error("Error auto-playing video:", e))
    }

    return () => {
      if (hlsRef.current) {
        hlsRef.current.destroy()
        hlsRef.current = null
      }
    }
  }, [hlsUrl, currentResolution])

  // Helper function to get the level index for a specific resolution
  const getLevelIndexForResolution = (hls: Hls, resolution: string): number => {
    if (!hls || !hls.levels || hls.levels.length === 0) return -1

    // Parse the resolution string (e.g., "720p")
    const targetHeight = resolution === "720p" ? 720 :
                         resolution === "240p" ? 240 : -1

    if (targetHeight === -1) return -1

    // Find the closest matching level
    return hls.levels.findIndex(level => level.height === targetHeight)
  }

  // Function to switch resolution
  const switchResolution = (resolution: string) => {
    if (!hlsRef.current || !resolution) return

    setCurrentResolution(resolution)
    const levelIndex = getLevelIndexForResolution(hlsRef.current, resolution)

    if (levelIndex !== -1) {
      hlsRef.current.currentLevel = levelIndex
    }
  }

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <h1 className="mb-6 text-2xl font-bold">HLS 视频演示</h1>

      <div className="mb-8 rounded-lg bg-white p-6 shadow-md">
        <h2 className="mb-4 text-2xl font-bold">上传视频</h2>
        <p className="mb-4 text-gray-600">
          上传视频文件，将其转换为 HLS 格式进行自适应流媒体播放。支持加密和多种分辨率。
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            const formData = new FormData(e.currentTarget)
            handleUpload(formData)
          }}
          className="space-y-4"
        >
          <div>
            <label
              htmlFor="video"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              视频文件
            </label>
            <input
              type="file"
              id="video"
              name="video"
              accept="video/*"
              required
              className="block w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 text-sm text-gray-900 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              支持的格式: MP4, MOV, AVI, WebM (最大 100MB)
            </p>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="encrypt"
              name="encrypt"
              defaultChecked={true}
              className="size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label
              htmlFor="encrypt"
              className="ml-2 block text-sm font-medium text-gray-700"
            >
              启用 AES-128 加密
            </label>
          </div>

          {isUploading && (
            <div>
              <div className="mb-1 flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  {uploadProgress < 100 ? "处理中..." : "完成"}
                </span>
                <span className="text-sm font-medium text-gray-700">
                  {uploadProgress}%
                </span>
              </div>
              <div className="h-2.5 w-full rounded-full bg-gray-200">
                <div
                  className="h-2.5 rounded-full bg-blue-600"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
              <p className="mt-1 text-sm text-gray-600">
                {uploadProgress < 100 ? "处理中..." : "完成中..."}
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-md border border-red-400 bg-red-100 p-4 text-red-700">
              <p>{error}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading}
            className="rounded bg-blue-500 px-4 py-2 font-medium text-white hover:bg-blue-600 disabled:opacity-50"
          >
            {isUploading ? "处理中..." : "转换为 HLS"}
          </button>
        </form>
      </div>

      {hlsUrl && (
        <div className="mt-4">
          <h3 className="mb-2 text-lg font-semibold">HLS 流</h3>
          <div className="rounded-md bg-gray-100 p-4">
            <p className="mb-2 break-all text-sm">
              <span className="font-semibold">URL:</span> {hlsUrl}
            </p>
            {conversionTime !== null && (
              <p className="mb-2 text-sm">
                <span className="font-semibold">转换时间:</span> {(conversionTime / 1000).toFixed(2)} 秒
              </p>
            )}

            {/* Video container with adaptive dimensions */}
            <div className={`relative bg-black aspect-${videoDimensions && videoDimensions.width < videoDimensions.height ? "[9/16]" : "video"}`}>
              <video
                ref={videoRef}
                className="size-full object-cover"
                controls
                playsInline
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />
            </div>

            {/* Resolution switcher */}
            {Object.keys(resolutions).length > 0 && (
              <div className="mt-3">
                <h4 className="mb-2 text-sm font-medium">分辨率:</h4>
                <div className="flex gap-2">
                  {Object.keys(resolutions).map((quality) => (
                    <button
                      key={quality}
                      onClick={() => switchResolution(quality)}
                      className={`rounded-full px-3 py-1 text-xs ${
                        currentResolution === quality
                          ? "bg-blue-600 text-white"
                          : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                      }`}
                    >
                      {quality} ({resolutions[quality]})
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-3">
              <h4 className="mb-2 text-sm font-medium">安全:</h4>
              <span className={`rounded-full px-3 py-1 text-xs ${isEncrypted ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                {isEncrypted ? "已加密 (AES-128)" : "未加密"}
              </span>
            </div>

            {videoDimensions && (
              <div className="mt-3">
                <h4 className="mb-2 text-sm font-medium">原始尺寸:</h4>
                <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-800">
                  {videoDimensions.width}×{videoDimensions.height}
                  {videoDimensions.width > videoDimensions.height ? " (横向)" : " (纵向)"}
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}