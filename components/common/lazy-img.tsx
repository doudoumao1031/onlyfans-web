"use client"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import { ComponentProps } from "react"
import { buildImageUrl } from "@/lib/utils"
import clsx from "clsx"
import { omit } from "lodash"

type MyImageProps = ComponentProps<typeof Image> & {
  containerAuto?: boolean
}
export default function LazyImg(props: MyImageProps): React.ReactNode {
  const [isLoading, setIsLoading] = useState(true)
  const restProps = omit(props,"containerAuto")
  return (
    <div className={clsx(
      "relative flex justify-center",
      !props.containerAuto ? "w-full h-full" :""
    )}
    >
      {isLoading && <Skeleton className={`${props.className} w-full h-full absolute `}></Skeleton>}
      {props.src && <Image {...restProps} onLoad={() => setIsLoading(false)}/>}
    </div>
  )
}

export function LazyImageWithFileId(props: Omit<MyImageProps, "src"> & { fileId: string }) {
  const { fileId } = props
  if (fileId) {
    const src = buildImageUrl(fileId)
    return <LazyImg {...props} src={src}/>
  }
  return (
    <Skeleton
      style={{
        width: props.width,
        height: props.height
      }}
    ></Skeleton>
  )
}
