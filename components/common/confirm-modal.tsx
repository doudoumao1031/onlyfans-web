"use client"
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog"
import { useTranslations } from "next-intl"
import React, { useState } from "react"

export default function ConfirmModal({
  confirm,
  cancel,
  trigger,
  content
}: {
  confirm?: () => void
  cancel?: () => void
  content: React.ReactNode
  trigger?: React.ReactNode
}) {
  const [openState, setOpenState] = useState<boolean>(false)
  const t = useTranslations("Common")
  return (
    <Dialog open={openState} onOpenChange={setOpenState}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className={"hide-modal-close border-none bg-transparent"}>
        <div className={"bg-white rounded-xl w-[270px] ml-auto mr-auto"}>
          <div className="py-7 px-4 text-center">{content}</div>
          <div className="grid grid-cols-2 text-base border-t border-[#ddd]">
            <button
              onTouchEnd={() => {
                cancel?.()
                setOpenState(false)
              }}
              className={"py-3.5 border-r border-[#ddd]"}
            >
              {t("cancel")}
            </button>
            <button
              onTouchEnd={() => {
                confirm?.()
                setOpenState(false)
              }}
              className={"py-3.5 text-text-pink font-medium"}
            >
              {t("confirm")}
            </button>
          </div>
        </div>
        <DialogHeader className={"hidden"}>
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}
