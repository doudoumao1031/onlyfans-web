import React from "react"
import "./profile.scss"
import { redirect } from "next/navigation"
import { isNumber } from "lodash"

export default async function Layout({
  children,
  params
}: {
  children: React.ReactNode,
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const numberId = Number(id)
  if (!isNumber(numberId) || isNaN(numberId) || numberId < 1) {
    redirect("/")
  }
  return (
    <>
      {children}
    </>
  )
}
