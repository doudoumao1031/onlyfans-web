"use client"

import { useState } from "react"

import { useTranslations } from "next-intl"
import Cropper from "react-easy-crop"

import Image from "next/image"

import IconWithImage from "@/components/profile/icon"
import { buildImageUrl, commonUploadFile } from "@/lib/utils"

import LazyImg from "../common/lazy-img"

interface Point {
  x: number
  y: number
}

interface Area {
  width: number
  height: number
  x: number
  y: number
}

export default function Avatar({
  showEdit,
  showLive,
  fileId,
  size = 84,
  onAvatarChange
}: {
  showEdit?: boolean
  showLive?: boolean
  fileId: string
  size?: number
  onAvatarChange?: (fileId: string) => void
}) {
  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null)
  const [showCropper, setShowCropper] = useState(false)
  const [tempImage, setTempImage] = useState<string | null>(null)
  const t = useTranslations("Common")

  const onCropComplete = (croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels)
  }

  const handleUploadFile = (file: File) => {
    const reader = new FileReader()
    reader.onload = () => {
      setTempImage(reader.result as string)
      setShowCropper(true)
    }
    reader.readAsDataURL(file)
  }

  const handleCropConfirm = async () => {
    if (!tempImage || !croppedAreaPixels) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const image = new window.Image()
    image.src = tempImage

    await new Promise<void>((resolve) => {
      image.onload = () => resolve()
    })

    canvas.width = croppedAreaPixels.width
    canvas.height = croppedAreaPixels.height

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      0,
      0,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    )

    canvas.toBlob((blob) => {
      if (blob) {
        const file = new File([blob], "cropped-image.jpg", { type: "image/jpeg" })
        commonUploadFile(file).then((res) => {
          if (res?.file_id) {
            onAvatarChange?.(res?.file_id)
          }
        })
      }
      setShowCropper(false)
      setTempImage(null)
    }, "image/jpeg")
  }

  return (
    <>
      <div className="relative rounded-full border border-gray-100 bg-white p-0.5" style={{ width: size, height: size, boxSizing: "content-box" }}>
        {showEdit && (
          <input
            type="file"
            accept="image/*"
            multiple={false}
            className="absolute z-10 size-full opacity-0"
            defaultValue=""
            onChange={(event) => {
              if (event.target.files?.length) {
                handleUploadFile(event.target.files[0])
                event.target.value = ""
              }
            }}
          />
        )}
        <section className="relative size-full rounded-full">
          <LazyImg
            src={fileId ? buildImageUrl(fileId) : "/icons/icon_fansX_head.png"}
            alt=""
            className="size-full rounded-full"
            width={size}
            height={size}
          />
          {showLive && (
            <div className="absolute bottom-2 right-0 rounded-full bg-white p-1.5">
              <Image
                className="rounded-full"
                src="/theme/icon_sign_gamevlog@3x.png"
                width={20}
                height={20}
                alt="live"
              />
            </div>
          )}
          {showEdit && (
            <div className="absolute bottom-0 left-0 flex h-[40px] w-full items-center justify-center rounded-b-full bg-[rgba(0,0,0,0.5)] text-white">
              <IconWithImage url="/theme/icon_camera@3x.png" width={24} height={24} />
            </div>
          )}
        </section>
      </div>

      {showCropper && tempImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="relative h-[80vh] w-[80vw] max-w-2xl">
            <Cropper
              image={tempImage}
              crop={crop}
              zoom={zoom}
              aspect={1}
              cropShape="round"
              showGrid={false}
              onCropChange={setCrop}
              onZoomChange={setZoom}
              onCropComplete={onCropComplete}
            />
            <div className="absolute inset-x-0 bottom-4 flex justify-center gap-4">
              <button
                onClick={() => setShowCropper(false)}
                className="rounded bg-gray-500 px-4 py-2 text-white"
              >
                {t("cancel")}
              </button>
              <button
                onClick={handleCropConfirm}
                className="rounded bg-blue-500 px-4 py-2 text-white"
              >
                {t("confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
