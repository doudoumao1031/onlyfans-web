import { Carousel, CarouselContent, CarouselItem  } from "@/components/ui/carousel"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import React from "react"
import { LazyImageWithFileId } from "@/components/common/lazy-img"

export interface ImageCarouselPreviewProps {
  openState: boolean
  setOpenState: (open: boolean) => void,
  imagesList: string[]
}

export function ImageCarouselPreview (props: ImageCarouselPreviewProps) {
  const { openState,setOpenState ,imagesList } = props

  return  (
    <Dialog open={openState} onOpenChange={setOpenState}>
      <DialogContent className={"hide-modal-close border-none bg-transparent"}>
        <div className={"w-10/12 ml-auto mr-auto"}>
          <Carousel>
            <CarouselContent>
              {imagesList.map(src => (
                <CarouselItem key={src}>
                  <LazyImageWithFileId alt={""} fileId={src} width={100} height={100} className={"w-full h-auto"}/>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
        <DialogHeader className={"hidden"}>
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}