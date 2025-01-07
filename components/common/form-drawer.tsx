"use client"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
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
  handleSubmit
}: {
    children: React.ReactNode,
    title?: React.ReactNode,
    headerLeft?: (close: () => void) => React.ReactNode,
    headerRight?: (close: () => void) => React.ReactNode,
    trigger: React.ReactNode,
    className?: string,
    outerControl?: boolean,
    isOpen?: boolean,
    setIsOpen?: (val: boolean) => void,
    handleSubmit?: (event:FormEvent) => void
}) {
  const [innerIsOpen, setInnerIsOpen] = useState<boolean>(false)
  const openState = outerControl ? isOpen : innerIsOpen
  const openChange = (outerControl && setIsOpen) ? setIsOpen : setInnerIsOpen
  const handleClose = () => openChange(false)
  return (
    <Drawer open={openState} onOpenChange={openChange}>
      {!outerControl && (
        <DrawerTrigger asChild>
          {trigger}
        </DrawerTrigger>
      )}
      <DrawerContent className={clsx(
        "h-[95vh] bg-white",
        className ?? ""
      )}
      >
        <form className={"flex-1"} onSubmit={handleSubmit}>
          <DrawerHeader className={"hidden"}>
            <DrawerTitle></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <ModalHeader title={title} left={headerLeft?.(handleClose)}
            right={headerRight?.(handleClose)}
          ></ModalHeader>
          {children}
        </form>
      </DrawerContent>
    </Drawer>
  )
}
