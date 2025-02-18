import React from "react"
import "./profile.scss"

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
