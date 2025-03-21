"use client"
import { useState , ComponentProps } from "react"



import clsx from "clsx"
import { omit } from "lodash"

import Image from "next/image"

import { Skeleton } from "@/components/ui/skeleton"
import { buildImageUrl } from "@/lib/utils"

type MyImageProps = ComponentProps<typeof Image> & {
  containerAuto?: boolean
}
export default function LazyImg(props: MyImageProps): React.ReactNode {
  const [isLoading, setIsLoading] = useState(true)
  const restProps = omit(props,"containerAuto")
  return (
    <div className={clsx(
      "relative flex justify-center",
      !props.containerAuto ? "size-full" :""
    )}
    >
      {isLoading && <Skeleton className={`${props.className} absolute size-full `}></Skeleton>}
      {props.src && <Image {...restProps} onLoad={() => setIsLoading(false)}/>}
    </div>
  )
}

export function LazyImageWithFileId(props: Omit<MyImageProps, "src"> & { fileId: string }) {
  const { fileId } = props
  if (fileId) {
    const src = buildImageUrl(fileId)
    const restProps = omit(props,"fileId")
    return <LazyImg {...restProps} src={src}/>
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
