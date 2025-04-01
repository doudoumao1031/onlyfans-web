"use client"
import useEmblaCarousel from "embla-carousel-react"

import LazyImg from "@/components/common/lazy-img"
import { buildImageUrl } from "@/lib/utils"

export default function EmblaCarousel({ ids, startIndex }: { ids: string[]; startIndex: number }) {
  const [emblaRef] = useEmblaCarousel({ startIndex: startIndex })
  return (
    <div className="embla max-h-screen max-w-[100vw] overflow-hidden bg-none" ref={emblaRef}>
      <div className="embla__container flex">
        {ids.map((v) => {
          return (
            <div key={v} className="embla__slide min-w-0 flex-[0_0_100%]">
              <LazyImg
                src={buildImageUrl(v)}
                alt=""
                width={1200}
                height={800}
                className="max-h-screen max-w-full object-contain"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}