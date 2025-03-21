import React, { useState } from "react"

import clsx from "clsx"
import { useTranslations } from "next-intl"

import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet"

export interface ISelectOption {
  label: React.ReactNode
  value: unknown
  description?: React.ReactNode
  extend?: unknown
  descriptionClassName?: string
}

export default function SheetSelect({
  children,
  options,
  onInputChange,
  isOpen,
  setIsOpen,
  outerControl = true
}: {
  children?: React.ReactNode
  options: ISelectOption[]
  onInputChange?: (value: string | number | readonly string[] | undefined) => void
  isOpen?: boolean
  setIsOpen?: (v: boolean) => void
  outerControl?: boolean
}) {
  const [sheetState, setSheetState] = useState<boolean>(false)
  const openState = outerControl ? isOpen : sheetState
  const changeState = outerControl ? setIsOpen : setSheetState
  const commonTrans = useTranslations("Common")
  // const [isOpen,setIsOpen] = useState<boolean>(false)
  return (
    <>
      <Sheet open={openState} onOpenChange={changeState}>
        {children && (
          <SheetTrigger asChild>
            <button
              className={"w-full"}
              onTouchEnd={() => {
                changeState?.(true)
              }}
            >
              {children}
            </button>
          </SheetTrigger>
        )}
        <SheetContent side={"bottom"} className={"hide-modal-close border-none px-2.5 py-0 pb-2.5"}>
          <SheetTitle className={"hidden"}></SheetTitle>
          <SheetDescription className={"hidden"}></SheetDescription>
          <div className="overflow-hidden rounded-2xl bg-white">
            {options.map((item, index, arr) => {
              return (
                <button
                  className={clsx(
                    "block w-full px-8 py-4 text-[20px]",
                    index !== arr.length - 1 ? "border-b border-b-gray-100" : ""
                  )}
                  key={index}
                  onTouchEnd={() => {
                    onInputChange?.(item.value as never)
                    changeState?.(false)
                  }}
                >
                  <span className={"text-neutral-800"}>
                    {item.label}
                  </span>
                  {item?.description && (
                    <div className={`truncate text-gray-400 ${item?.descriptionClassName}`}>
                      <span>{item?.description}</span>
                    </div>
                  )}
                </button>
              )
            })}
          </div>
          <div className={"mt-2.5"}></div>
          <SheetFooter>
            <SheetClose asChild>
              {/*<Button type="submit">Save changes</Button>*/}
              <button
                className={
                  "text-text-theme block w-full rounded-2xl bg-white px-8 py-4 text-[20px] font-bold"
                }
              >
                {commonTrans("cancel")}
              </button>
            </SheetClose>
          </SheetFooter>
        </SheetContent>
      </Sheet>
    </>
  )
}
