import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"
import React, { useState } from "react"
import clsx from "clsx"
import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"


export default function DatePickerModal({ trigger, onValueChange }: {
    trigger: React.ReactNode,
    onValueChange?: (value: Date) => void
}) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className={clsx("bg-white hide-modal-close border-none bg-transparent",)}>
        <section className={"flex-1 bg-white rounded-xl w-[252px] ml-auto mr-auto"}>
          <DrawerHeader className={"hidden"}>
            <DrawerTitle></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <Calendar onDayClick={(value) => {
            onValueChange?.(value)
            setIsOpen(false)
          }} mode="single" initialFocus
          />
        </section>
      </DialogContent>
    </Dialog>
  )
}