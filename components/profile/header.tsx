import React from "react";

export default function Header({right}: { right?: React.ReactNode }) {
    return <section className="flex align-middle justify-between items-center h-[44px] pl-4 pr-4">
        <div className="flex justify-start shrink-0 w-[30%]">&lt;</div>
        <div className="text-center flex-1 text-[18px]">My</div>
        <div className="flex justify-end shrink-0 w-[30%] gap-5 items-center">{right}</div>
    </section>
}