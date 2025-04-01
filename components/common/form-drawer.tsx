"use client"
import React, { FormEvent, useState } from "react"

import { clsx } from "clsx"

import ModalHeader from "@/components/common/modal-header"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"

export default function FormDrawer({
  children,
  headerRight,
  headerLeft,
  trigger,
  title,
  className,
  isOpen,
  setIsOpen,
  outerControl,
  handleSubmit,
  isAutoHeight = false
}: {
  children: React.ReactNode
  title?: React.ReactNode
  headerLeft?: (close: () => void) => React.ReactNode
  headerRight?: (close: () => void) => React.ReactNode
  trigger?: React.ReactNode
  className?: string
  outerControl?: boolean
  isOpen?: boolean
  setIsOpen?: (val: boolean) => void
  handleSubmit?: (event: FormEvent) => void
  isAutoHeight?: boolean
}) {
  const [innerIsOpen, setInnerIsOpen] = useState<boolean>(false)
  const openState = outerControl ? isOpen : innerIsOpen
  const openChange = outerControl && setIsOpen ? setIsOpen : setInnerIsOpen
  const handleClose = () => openChange(false)
  return (
    <Drawer open={openState} onOpenChange={openChange}>
      {!outerControl && <DrawerTrigger asChild>{trigger}</DrawerTrigger>}
      <DrawerContent
        className={clsx("bg-white", isAutoHeight ? "h-auto" : "h-[95vh]", className ?? "")}
      >
        <form className={"flex h-full flex-1 flex-col"} onSubmit={handleSubmit}>
          <DrawerHeader className={"hidden"}>
            <DrawerTitle></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <div className={"shrink-0"}>
            <ModalHeader
              title={title}
              left={headerLeft?.(handleClose)}
              right={headerRight?.(handleClose)}
            ></ModalHeader>
          </div>
          <div className={"flex-1 overflow-auto pb-6"}>
            {children}
          </div>
        </form>
      </DrawerContent>
      <DrawerFooter className={"hidden"}></DrawerFooter>
    </Drawer>
  )
}
