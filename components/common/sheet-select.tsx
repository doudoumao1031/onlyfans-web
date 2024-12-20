import {
    Sheet, SheetClose,
    SheetContent, SheetDescription, SheetFooter, SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import React from "react";
import clsx from "clsx";

export interface ISelectOption {
    label: React.ReactNode,
    value: string,
    description?: React.ReactNode
}


export default function SheetSelect({children, options, onInputChange, isOpen, setIsOpen}: {
    children: React.ReactNode, options: ISelectOption[],
    onInputChange?: (value: string) => void,
    isOpen: boolean,
    setIsOpen: (v: boolean) => void
}) {
    // const [isOpen,setIsOpen] = useState<boolean>(false)
    return <>
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
                <button onTouchEnd={() => {
                    setIsOpen(true)
                }}>{children}</button>
            </SheetTrigger>
            <SheetContent side={"bottom"} className={"px-2.5 py-0 pb-2.5 border-none sheet-select"}>
                <SheetTitle className={"hidden"}></SheetTitle>
                <SheetDescription className={"hidden"}></SheetDescription>
                <div className="bg-white rounded-2xl overflow-hidden">
                    {options.map((item, index, arr) => {
                        return (
                            <button
                                className={
                                    clsx(
                                        "pl-8 pr-8 pt-4 pb-4 text-[19px] text-neutral-800 block w-full",
                                        index !== arr.length - 1 ? "border-b border-b-gray-100" : ""
                                    )
                                }
                                key={index}
                                onTouchEnd={() => {
                                    onInputChange?.(item.value);
                                    setIsOpen(false)
                                }}
                            >
                                {item.label}
                                {item?.description && <span className="text-gray-300">{item?.description}</span>}
                            </button>
                        );
                    })}
                </div>
                <div className={"mt-2.5"}>

                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        {/*<Button type="submit">Save changes</Button>*/}
                        <button
                            className={"block font-bold bg-white rounded-2xl w-full pl-8 pr-8 pt-4 pb-4 text-main-pink text-base"}>取消
                        </button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    </>
}