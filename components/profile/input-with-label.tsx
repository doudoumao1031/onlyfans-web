"use client"
import {
  ReactNode,
  InputHTMLAttributes,
  useState,
  useMemo,
  useCallback,
  useRef
} from "react"
import clsx from "clsx"
import IconWithImage from "@/components/profile/icon"
import SheetSelect, { ISelectOption } from "@/components/common/sheet-select"

type InputValueType = string | number | readonly string[] | undefined


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: ReactNode,
    name?: string,
    value: InputValueType,
    disabled?: boolean,
    description?: ReactNode,
    errorMessage?: ReactNode,
    options?: ISelectOption[],
    onInputChange?: (value: InputValueType) => void,
}

export default function InputWithLabel(props: InputProps) {
  const { label, name, disabled, onInputChange, description, value, options,errorMessage } = props
  // const [val, setVal] = useState<InputValueType>(value ?? "")
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

  const [positionInCenter, setPositionInCenter] = useState<boolean>(() => {
    return value === ""
  })

  const labelTouch = useCallback(() => {
    if (!positionInCenter) return
    setPositionInCenter(false)
    setTimeout(() => {
      inputRef?.current?.focus?.()
    },100)
  }, [positionInCenter])


  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const inputBlur = useCallback((event) => {
    props?.onBlur?.(event)
    if (value) return
    if (positionInCenter) return
    setPositionInCenter(true)
  }, [positionInCenter, value,props])

  const inputFocus = useCallback(() => {
    if (positionInCenter) {
      setPositionInCenter(false)
    }
  }, [
    positionInCenter
  ])

  const optionShowLabel = useMemo(() => {
    if (!isSelectInput) return ""
    const option = options?.find(item => item.value === value)
    return  option?.label ?? ""
  },[isSelectInput,value,options])

  return (
    <section className={clsx(
      "relative rounded-xl",
      // isSelectInput ? "pt-2.5" : "",
      props.className
    )}
    >
      <label
        style={{
          transition: "top .1s",
          top: positionInCenter ? 16 : -7
        }} onTouchEnd={labelTouch} className={clsx(
          "absolute bg-white left-4 leading-none font-normal z-30 transition text-[#6D7781]",
        )}
        htmlFor={name}
      >
        {label}
      </label>
      <section
        className={
          clsx("flex pt-[12px] pb-[12px] pl-4 pr-4 rounded-xl border border-[rgb(221,221,221)] relative z-20 items-center",
            disabled ? "bg-[#F7F7F7]" : "",)
        }
      >
        {!isSelectInput && (
          <input ref={inputRef} onBlur={inputBlur} onFocus={inputFocus} name={name} value={value} onTouchEnd={handleInputTouch}
            onChange={event => {
              const eventValue = (event.target as HTMLInputElement).value
              // setVal(eventValue)
              onInputChange?.(eventValue)
            }} type="text" disabled={disabled} readOnly={disableInput || props.readOnly} className={clsx(
              "flex-1 w-full font-medium",

            )} placeholder={(positionInCenter || value === "") ? props?.placeholder : ""}
          />
        )}
        {isSelectInput && (
          <>
            <div className={clsx("flex-1 w-full font-medium", !optionShowLabel ? "text-gray-300" : "")}>{optionShowLabel || props?.placeholder}</div>
            <SheetSelect
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              onInputChange={(v => {
                // setVal(v)
                onInputChange?.(v)
              })} options={options ?? []}
            >
              <IconWithImage url={"/icons/profile/icon_arrow_down@3x.png"} width={24}
                height={24} color={"#bbb"}
              />
            </SheetSelect>
          </>
        )}
      </section>
      {errorMessage && <div className="text-red-600 text-xs px-4 mt-1.5">{errorMessage}</div>}
      {description && !errorMessage && <section className="text-[#6D7781] text-xs px-4 mt-1.5">{description}</section>}
    </section>
  )
}
