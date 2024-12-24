"use client";
import {
    Dialog,
    DialogHeader,
    DialogTitle,
    DialogContent,
    DialogDescription,
    DialogTrigger
} from "@/components/ui/dialog";
import React, {useState} from "react";


export default function ConfirmModal({confirm, cancel, trigger, content}: {
    confirm?: () => void,
    cancel?: () => void,
    content: React.ReactNode,
    trigger?: React.ReactNode
}) {
    const [openState, setOpenState] = useState<boolean>(false)
    return <Dialog open={openState} onOpenChange={setOpenState}>
        <DialogTrigger asChild>
            {trigger}
        </DialogTrigger>
        <DialogContent className={"hide-modal-close border-none bg-transparent"}>
            <div className={"bg-white rounded-xl"}>
                <div className="py-7 px-4 text-center">{content}</div>
                <div className="grid grid-cols-2 text-base border-t border-[#ddd]">
                    <button onTouchEnd={() => {
                        cancel?.()
                        setOpenState(false)
                    }} className={"py-3.5 border-r border-[#ddd]"}>取消
                    </button>
                    <button onTouchEnd={() => {
                        confirm?.()
                        setOpenState(false)
                    }} className={"py-3.5 text-main-pink font-medium"}>确定
                    </button>
                </div>
            </div>
            <DialogHeader className={"hidden"}>
                <DialogTitle/>
                <DialogDescription/>
            </DialogHeader>
        </DialogContent>
    </Dialog>
}