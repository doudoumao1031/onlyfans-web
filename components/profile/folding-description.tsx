"use client"
import { useState } from "react"

export default function FoldingDescription ({ about }:{about:string}) {
  const [hideState,setHideState] = useState(true)
  return (
    <>
      <section className={"overflow-hidden"} style={{ height: hideState ? "2.5em" : "auto" }} dangerouslySetInnerHTML={{ __html:about }}></section>
      {about && hideState && (
        <button className="text-main-pink mt-1" type={"button"} onTouchEnd={() => {
          setHideState(false)
        }}
        >更多信息</button>
      )}
    </>
  )
}