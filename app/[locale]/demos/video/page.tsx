"use client"
// import { useEffect, useState } from "react"

// import { mediaHls, mediaHlsData } from "@/lib"

import HlsPlayer from "./hls-player"

const VideoPage = () => {
  const videoUrl = "https://imfanstest.potato.im/api/v1/media/hlsdata/49ed00b6-7ec5-44d5-8736-b1dd0a344620.m3u8"
  const encryptionKeyUrl = "https://imfanstest.potato.im/api/v1/media/enc"
  // const [videoUrl,setVideoUrl] = useState<string>("")
  // useEffect( () => {
  //   getUrl()
  // },[])
  // const getUrl = async () => {
  //   const res = await mediaHlsData("7b09ed2e-c5f4-47dd-a502-4c700a5e1c43")
  //   console.log(res,"es======")

  //   setVideoUrl(res as unknown as string)
  // }
  return (
    <div>
      <h1>Encrypted HLS Video Player</h1>
      <HlsPlayer src={videoUrl} encryptionKeyUrl={encryptionKeyUrl} />
    </div>
  )
}

export default VideoPage