import {ReactNode, InputHTMLAttributes} from "react";
import clsx from "clsx";


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: ReactNode,
    name: string,
    value: string,
    disabled?: boolean,
    description?: ReactNode
}

export default function InputWithLabel({label, name, disabled, description, value, ...restProps}: InputProps) {
    return <section className="relative pt-2.5">
        <label className="absolute top-[4px] bg-white left-6 leading-none text-neutral-500"
               htmlFor={name}>{label}</label>
        <input value={value} type="text" disabled={disabled} className={clsx(
            "block w-full pt-[14px] pb-[14px] pl-4 pr-4 rounded-xl border border-[rgb(221,221,221)]",
            disabled ? "bg-[#F7F7F7]" : ""
        )} {...restProps}/>
        {description && <section className="text-neutral-500 text-xs pl-4 mt-1.5">{description}</section>}
    </section>
}