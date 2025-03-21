import React from "react"

export default function ModalHeader({ title, right, left }: {
    title: React.ReactNode,
    right?: React.ReactNode,
    left?: React.ReactNode,
}) {
  return (
    <section className="flex h-[44px] items-center justify-between px-4 align-middle text-black">
      <div className="flex w-[30%] shrink-0 justify-start">{left}</div>
      <div className="flex-1 text-center text-[18px]">{title}</div>
      <div className="flex w-[30%] shrink-0 items-center justify-end gap-5">{right}</div>
    </section>
  )
}