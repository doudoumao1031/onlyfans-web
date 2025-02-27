import Image from "next/image"
import { useState } from "react"

export default function CheckboxLabel({ disabled = false, checked, label, change }: {
    disabled?: boolean,
    checked?: boolean,
    label: string,
  change: (newChecked: boolean) => void
}) {
  const [checkedState, setCheckedState] = useState(checked)
  const handleToggle = () => {
    const newChecked = !checkedState
    setCheckedState(newChecked)
    change(newChecked) // 调用回调函数并将新的状态传递给父组件
  }
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        disabled={disabled}
        defaultChecked={checked}
        className="hidden"
      />
      <Image
        src={checkedState ? "/theme/checkbox_select@3x.png" : "/theme/checkbox_normal@3x.png"}
        width={20}
        height={20}
        alt="select"
        className="cursor-pointer"
        onTouchEnd={handleToggle}
      />
      <span className="font-normal text-base ml-2">{label}</span>
    </div>
  )
}