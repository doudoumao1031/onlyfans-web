"use client"

import { useMemo } from "react"

export default function IconWithImage({
  url,
  width,
  height,
  color,
  className
}: {
  url: string;
  width?: number;
  height?: number;
  color?: string;
  className?: string
}) {
  const backgroundColor = useMemo(() => {
    if (className) {
      return {}
    }
    return {
      backgroundColor: color ?? "#fff"
    }
  },[className,color])
  return (
    <div
      className={className}
      style={{
        height,
        width,
        maskImage: `url(${url})`,
        maskSize: `${width}px ${height}px`,
        ...backgroundColor
      }}
    ></div>
  )
}
