"use client";
import { useState } from "react"

export default function Page() {
    const [isOpen, setIsOpen] = useState<boolean>(false)
    return <div className="text-xs mt-2.5">
        <section className={!isOpen ? "flex h-4 overflow-hidden text-ellipsis ..." : ''}>Content Creator, Published Cover model, Biochem Gr Content , Published Cover model, Biochem,place where I can answer my DMs! </section>
        <button className="text-main-pink mt-1" onTouchEnd={() => { setIsOpen(!isOpen) }}>{isOpen ? '折叠信息' : '更多信息'}</button>
    </div>
}