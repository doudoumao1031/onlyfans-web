"use client"
import useEmblaCarousel from "embla-carousel-react"
import LazyImg from "@/components/common/lazy-img"
import { buildImageUrl } from "@/lib/utils"

export default function EmblaCarousel({ ids, startIndex }: { ids: string[]; startIndex: number }) {
  const [emblaRef] = useEmblaCarousel({ startIndex: startIndex })
  return (
    <div className="embla overflow-hidden bg-none max-w-[100vw] max-h-[100vh]" ref={emblaRef}>
      <div className="embla__container flex">
        {ids.map((v) => {
          return (
            <div key={v} className="embla__slide flex-[0_0_100%] min-w-0">
              <LazyImg
                src={buildImageUrl(v)}
                alt=""
                width={1200}
                height={800}
                className="object-contain max-w-full max-h-[100vh]"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}