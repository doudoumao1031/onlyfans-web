"use client"
import { getUploadMediaFileType, uploadFile } from "@/lib/utils"
import { useState } from "react"
import { completeFile, uploadMediaFile } from "@/lib"

export default function FileUpload({ type }:{type: string}) {

  return (
    <input
      type="file"
      accept="image/*"
      multiple={false}
      className="block w-full h-full absolute left-0 top-0 opacity-0 z-10"
      onChange={(event) => {
        if (event.target.files?.length) {
          uploadFile(event.target.files[0])
        }
      }}
    />
  )
}
