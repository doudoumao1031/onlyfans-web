import React from "react"
import "./profile.scss"
import { redirect } from "next/navigation"
import { isNumber } from "lodash"

export default  function Layout({
  children
}: {
  children: React.ReactNode,
}) {
  return (
    <>
      {children}
    </>
  )
}
