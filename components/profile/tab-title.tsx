import React, { useCallback } from "react"
import clsx from "clsx"

export interface iTabTitleOption {
    label: React.ReactNode,
    name: string
}

export default function TabTitle({ tabOptions, active, activeChange }: {
    tabOptions: iTabTitleOption[], active: string, activeChange: (value: string) => void
}) {

  const activeClass = useCallback((name: string) => {
    if (active === name) {
      return "font-bold text-black "
    }
    return "text-[#777] font-normal"
  }, [active])


  return (
    <div className="grid grid-cols-2 border-b border-gray-100">
      {tabOptions.map((item, index) => (
        <button className={clsx("pt-3.5 pb-3.5 text-[20px] relative", activeClass(item.name))} onTouchEnd={() => {
          activeChange(item.name)
        }} key={index}
        >{item.label} <span className={clsx("absolute left-[50%] bottom-0 h-[3px] rounded-tl-lg rounded-tr-lg bg-theme w-[40px] ml-[-20px]", active === item.name ? "block" :"hidden")}></span></button>
      ))}
    </div>
  )
}