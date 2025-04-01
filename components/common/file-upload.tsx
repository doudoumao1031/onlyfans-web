"use client"
import { useState } from "react"

import { completeFile, uploadMediaFile } from "@/lib"
import { getUploadMediaFileType, uploadFile } from "@/lib/utils"

export default function FileUpload({ type }:{type: string}) {

  return (
    <input
      type="file"
      accept="image/*"
      multiple={false}
      className="absolute left-0 top-0 z-10 block size-full opacity-0"
      onChange={(event) => {
        if (event.target.files?.length) {
          uploadFile(event.target.files[0])
        }
      }}
    />
  )
}
