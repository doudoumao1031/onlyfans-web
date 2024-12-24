"use client";
import {
    ReactNode,
    InputHTMLAttributes,
    useState,
    useMemo,
    useCallback,
    useRef
} from "react";
import clsx from "clsx";
import IconWithImage from "@/components/profile/icon";
import SheetSelect, {ISelectOption} from "@/components/common/sheet-select";


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: ReactNode,
    name: string,
    value: string,
    disabled?: boolean,
    description?: ReactNode,
    options?: ISelectOption[],
    onInputChange?: (value: string) => void,
}

export default function InputWithLabel(props: InputProps) {
    const {label, name, disabled, onInputChange, description, value, options} = props
    const [val, setVal] = useState<string>(value ?? "")
    const [isOpen, setIsOpen] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null)
    const isSelectInput = useMemo(() => {
        return options !== undefined && Array.isArray(options)
    }, [options])

    const disableInput = useMemo(() => {
        if (isSelectInput) return true
        return disabled
    }, [disabled, isSelectInput])

    const handleInputTouch = () => {
        if (!isSelectInput) return
        setIsOpen(true)
    }

    const [positionInCenter, setPositionInCenter] = useState<boolean>(true)

    const labelTouch = useCallback(() => {
        if (!positionInCenter) return
        setPositionInCenter(false)
        setTimeout(()=>{
            inputRef?.current?.focus?.()
        },100)
    }, [positionInCenter])


    const inputBlur = useCallback(() => {
        if (val) return
        if (positionInCenter) return;
        setPositionInCenter(true)
    }, [positionInCenter, val])

    const inputFocus = useCallback(() => {
        if (positionInCenter) {
            setPositionInCenter(false)
        }
    }, [
        positionInCenter
    ])

    return <section className={clsx(
        "relative",
        isSelectInput ? "pt-2.5" : "",
        props.className
    )}>
        <label style={{
            transition: "top .1s",
            top: positionInCenter ? 16 : -7
        }} onTouchEnd={labelTouch} className={clsx(
            "absolute bg-white left-4 leading-none text-neutral-500 z-30 transition",
        )}
               htmlFor={name}>{label}</label>
        <section
            className="flex pt-[12px] pb-[12px] pl-4 pr-4 rounded-xl border border-[rgb(221,221,221)] relative z-20">
            <input ref={inputRef} onBlur={inputBlur} onFocus={inputFocus} name={name} value={val} onTouchEnd={handleInputTouch}
                   onInput={event => {
                       const eventValue = (event.target as HTMLInputElement).value
                       setVal(eventValue)
                       onInputChange?.(eventValue)
                   }} type="text" disabled={disabled} readOnly={disableInput} className={clsx(
                "flex-1 w-full",
                disabled ? "bg-[#F7F7F7]" : ""
            )} placeholder={positionInCenter ? "" : props?.placeholder}/>
            {isSelectInput &&
              <SheetSelect
                isOpen={isOpen}
                setIsOpen={setIsOpen}
                onInputChange={(v => {
                    setVal(v)
                    onInputChange?.(v)
                })} options={options ?? []}><IconWithImage url={"/icons/profile/icon_arrow_down@3x.png"} width={24}
                                                           height={24} color={'#bbb'}/></SheetSelect>}
        </section>
        {description && <section className="text-neutral-500 text-xs px-4 mt-1.5">{description}</section>}
    </section>
}