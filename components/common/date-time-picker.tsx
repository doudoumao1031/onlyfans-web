"use client"
import React, { ReactNode, useEffect, useState } from "react"
import { DatePickerView } from "antd-mobile"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"

export default function DateTimePicker(props: {
  className?: string,
  value: number,
  dateChange: (value: number) => void,
  disabled?: boolean,
  children: ReactNode,
  max?: Date,
  min?: Date
} ) {
  const [visible,setVisible] = useState<boolean>(false)
  const {  value, dateChange ,children,max,min } = props
  const [inputValue, setInputValue] = useState<Date>()
  useEffect(() => {
    if (value > 0) {
      setInputValue(new Date(value))
    }
  }, [value])

  return (
    <>
      <button type={"button"} className={"block w-full text-left"} onTouchEnd={() => {
        setVisible(true)
      }}
      >{children}</button>
      <Drawer open={visible} onOpenChange={setVisible}>
        <DrawerContent className={"bg-white"}>
          <section className={"flex-1"}>
            <DrawerHeader className={"hidden"}>
              <DrawerTitle></DrawerTitle>
              <DrawerDescription></DrawerDescription>
            </DrawerHeader>
            <section className={"flex justify-between px-4"}>
              <button type={"button"} onTouchEnd={() => {
                setVisible(false)
              }}
              >取消</button>
              <button className={"text-main-pink"} type={"button"} onTouchEnd={() => {
                setVisible(false)
                if (inputValue) {
                  dateChange(inputValue.valueOf())
                }
              }}
              >确定</button>
            </section>
            <DatePickerView precision={"minute"} value={inputValue} onChange={setInputValue} max={max} min={min}/>
          </section>
        </DrawerContent>
      </Drawer>
    </>
  )
}