import React, { useState } from "react"

import clsx from "clsx"

import { Calendar } from "@/components/ui/calendar"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import {
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"


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
      <DialogContent className={clsx("hide-modal-close border-none bg-transparent")}>
        <section className={"mx-auto w-[252px] flex-1 rounded-xl bg-white"}>
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