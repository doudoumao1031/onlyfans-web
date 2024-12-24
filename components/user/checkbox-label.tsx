import Image from "next/image";
import {useState} from "react"

export default function CheckboxLabel({disabled = false, checked, label}: {
    disabled?: boolean,
    checked?: boolean,
    label: string
}) {
    const [checkedState, setCheckedState] = useState(checked);
    return (
        <div className="flex items-center">
            <input
                type="checkbox"
                disabled={disabled}
                defaultChecked={checked}
                className="hidden"
            />
            <Image
                src={checkedState ? "/icons/checkbox_select@3x.png" : "/icons/checkbox_normal@3x.png"}
                width={20}
                height={20}
                alt="select"
                className="cursor-pointer"
                onTouchEnd={()=>{
                    setCheckedState(!checkedState);
                }}
            />
            <span className="font-normal text-base ml-2">{label}</span>
        </div>
    )
}