"use client"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import Image from "next/image"
import React, { ComponentProps } from "react"

type MyImageProps = ComponentProps<typeof Image> & {};
export default function LazyImg(props: MyImageProps): React.ReactNode {
  const [isLoading, setIsLoading] = useState(true)
  return (
    <div className="relative" style={{
      width: props.width,
      height: props.height
    }}
    >
      {
        (isLoading) && <Skeleton className={`${props.className} w-full h-full absolute `}></Skeleton>
      }
      {props.src && <Image {...props} onLoad={() => setIsLoading(false)}/>}
    </div>

  )
}