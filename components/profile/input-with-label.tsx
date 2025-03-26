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

import SheetSelect, { ISelectOption } from "@/components/common/sheet-select"
import IconWithImage from "@/components/profile/icon"

import CopyText from "../common/copy-text"

type InputValueType = string | number | readonly string[] | undefined


interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode,
  name?: string,
  value: InputValueType,
  disabled?: boolean,
  description?: ReactNode,
  errorMessage?: ReactNode,
  options?: ISelectOption[],
  labelClass?: string,
  iconSize?: number,
  onInputChange?: (value: InputValueType) => void,
  type?: "text" | "textarea",
  rows?: number
  copy?: boolean
}


export default function InputWithLabel(props: InputProps) {
  const { label, type = "text", rows = 3, name, disabled, onInputChange, description, value, options, errorMessage, iconSize, copy, maxLength } = props
  // const [val, setVal] = useState<InputValueType>(value ?? "")
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const inputRef = useRef(null)
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
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      inputRef?.current?.focus?.()
    }, 100)
  }, [positionInCenter])


  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const inputBlur = useCallback((event) => {
    props?.onBlur?.(event)
    if (value) return
    if (positionInCenter) return
    setPositionInCenter(true)
  }, [positionInCenter, value, props])

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
    return option?.label ?? ""
  }, [isSelectInput, value, options])

  const isTextArea = type === "textarea"

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
          "absolute left-4 z-30 bg-white font-normal leading-none text-gray-secondary transition"
        )}
        htmlFor={name}
      >
        {label}
      </label>
      <section
        className={
          clsx(`flex ${props.labelClass ? props.labelClass : "px-4 py-[12px]"} relative z-20 items-center rounded-xl border border-[rgb(221,221,221)]`,
            disabled ? "bg-[#F7F7F7]" : "")
        }
      >
        {!isSelectInput && !isTextArea && (
          <input maxLength={maxLength} ref={inputRef} onBlur={inputBlur} onFocus={inputFocus} name={name} value={value} onTouchEnd={handleInputTouch}
            onChange={event => {
              const eventValue = (event.target as HTMLInputElement).value
              // setVal(eventValue)
              onInputChange?.(eventValue)
            }} type={type ?? "text"} disabled={disabled} readOnly={disableInput || props.readOnly} className={clsx(
              "w-full flex-1 font-medium"

            )} placeholder={(positionInCenter || value === "") ? props?.placeholder : ""}
          />
        )}
        {!isSelectInput && isTextArea && (
          <textarea maxLength={maxLength} ref={inputRef} onBlur={inputBlur} rows={rows} onFocus={inputFocus} name={name} value={value} onTouchEnd={handleInputTouch}
            onChange={event => {
              const eventValue = (event.target as HTMLTextAreaElement).value
              // setVal(eventValue)
              onInputChange?.(eventValue)
            }} disabled={disabled} readOnly={disableInput || props.readOnly} className={clsx(
              "w-full flex-1 font-medium"
            )} placeholder={(positionInCenter || value === "") ? props?.placeholder : ""}
          />
        )}
        {isSelectInput && (
          <>
            <SheetSelect
              isOpen={isOpen}
              setIsOpen={setIsOpen}
              onInputChange={(v => {
                // setVal(v)
                onInputChange?.(v)
              })} options={options ?? []}
            >
              <div className={"flex w-full items-center"}>
                <div className={clsx("flex-1 text-left font-medium", !optionShowLabel ? "text-gray-300" : "")}>{optionShowLabel || props?.placeholder}</div>
                <IconWithImage url={"/icons/profile/icon_arrow_down@3x.png"} width={iconSize || 24}
                  height={iconSize || 24} color={"#bbb"}
                />
              </div>
            </SheetSelect>
          </>
        )}
      </section>
      {errorMessage && <div className="text-theme mt-1.5 px-4 text-xs">{errorMessage}</div>}
      {description && !errorMessage && (
        <section className="mt-1.5 flex items-center px-4 text-xs text-gray-secondary">{description}
          {
            copy && <CopyText text={description.toString()} />
          }
        </section>
      )}
    </section>
  )
}
