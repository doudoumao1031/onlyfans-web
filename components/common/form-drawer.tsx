"use client"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import ModalHeader from "@/components/common/modal-header"
import React, { FormEvent, useState } from "react"
import { clsx } from "clsx"

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
        <form className={"flex-1 max-h-full"} onSubmit={handleSubmit}>
          <DrawerHeader className={"hidden"}>
            <DrawerTitle></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <ModalHeader
            title={title}
            left={headerLeft?.(handleClose)}
            right={headerRight?.(handleClose)}
          ></ModalHeader>
          {children}
        </form>
      </DrawerContent>
      <DrawerFooter className={"hidden"}></DrawerFooter>
    </Drawer>
  )
}
