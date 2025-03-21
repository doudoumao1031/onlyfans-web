"use client"
import React, { useState } from "react"

import { useTranslations } from "next-intl"

import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogContent,
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog"

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
        <div className={"mx-auto w-[270px] rounded-xl bg-white"}>
          <div className="px-4 py-7 text-center">{content}</div>
          <div className="grid grid-cols-2 border-t border-[#ddd] text-base">
            <button
              onTouchEnd={() => {
                cancel?.()
                setOpenState(false)
              }}
              className={"border-r border-[#ddd] py-3.5"}
            >
              {t("cancel")}
            </button>
            <button
              onTouchEnd={() => {
                confirm?.()
                setOpenState(false)
              }}
              className={"text-text-theme py-3.5 font-medium"}
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
