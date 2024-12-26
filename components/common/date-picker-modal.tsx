import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import React from "react";
import clsx from "clsx";
import {Calendar} from "@/components/ui/calendar";


export default function DatePickerModal({isOpen, setIsOpen, onValueChange}: {
    isOpen: boolean,
    setIsOpen: (value: boolean) => void,
    onValueChange?: (value: Date) => void
}) {
    return <Drawer open={isOpen} onOpenChange={setIsOpen}>
        <DrawerContent className={clsx("h-[95vh] bg-white",)}>
            <section className={"flex-1"}>
                <DrawerHeader className={"hidden"}>
                    <DrawerTitle></DrawerTitle>
                    <DrawerDescription></DrawerDescription>
                </DrawerHeader>
                <Calendar onDayClick={onValueChange}/>
            </section>
        </DrawerContent>
    </Drawer>
}