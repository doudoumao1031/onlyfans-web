import { InputHTMLAttributes, useEffect, useState } from "react"
import { clsx } from "clsx"
import dayjs from "dayjs"

export default function DateTimePicker(props: {
  className?: string,
  value: number,
  dateChange: (value: number) => void,
  disabled?: boolean
} & InputHTMLAttributes<HTMLInputElement>) {
  const { className, value, dateChange } = props
  // const [value,setValue] = useState<number>()
  const [inputValue, setInputValue] = useState<string>("")
  useEffect(() => {
    if (value > 0) {
      setInputValue(new Date(value).toString())
    }
  }, [value])

  return (
    <input
      {...props}
      className={
        clsx("w-full", className)
      } type={"datetime-local"}
      value={inputValue} onChange={(event) => {
        setInputValue(event.target.value)
        dateChange(dayjs(event.target.value).valueOf())
      }}
    />
  )
}