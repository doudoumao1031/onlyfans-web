"use client";
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import ModalHeader from "@/components/common/modal-header";
import React, {useState} from "react";


export default function FormDrawer({children, headerRight, headerLeft, trigger, title}: {
    children: React.ReactNode,
    title?: React.ReactNode,
    headerLeft?: (close: () => void) => React.ReactNode,
    headerRight?: (close: () => void) => React.ReactNode,
    trigger: React.ReactNode,
}) {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const handleClose = () => setIsOpen(false)
    return <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerTrigger asChild>
            {trigger}
        </DrawerTrigger>
        <DrawerContent className={"h-[95vh] bg-white"}>
            <section className={"flex-1"}>
                <DrawerHeader className={"hidden"}>
                    <DrawerTitle></DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                <ModalHeader title={title} left={headerLeft?.(handleClose)}
                             right={headerRight?.(handleClose)}></ModalHeader>
                {children}
            </section>
        </DrawerContent>
    </Drawer>
}