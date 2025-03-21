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
        <button className={clsx("relative py-3.5 text-[20px]", activeClass(item.name))} onTouchEnd={() => {
          activeChange(item.name)
        }} key={index}
        >{item.label} <span className={clsx("bg-theme absolute bottom-0 left-[50%] ml-[-20px] h-[3px] w-[40px] rounded-t-lg", active === item.name ? "block" :"hidden")}></span></button>
      ))}
    </div>
  )
}