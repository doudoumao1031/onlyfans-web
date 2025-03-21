"use client"

import { useEffect, useRef } from "react"

import { createPortal } from "react-dom"

import { useRouter } from "next/navigation"


export function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    if (!dialogRef.current?.open) {
      dialogRef.current?.showModal()
    }
  }, [])

  function onDismiss() {
    router.back()
  }

  return createPortal(
    <div className="modal-backdrop">
      <dialog ref={dialogRef} className="modal max-h-screen w-screen max-w-[100vw]" onClose={onDismiss}>
        {children}
        <button
          onClick={onDismiss}
          className="absolute right-4 top-4 rounded-full bg-black/50 p-2 text-white hover:bg-black/70"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
        </button>
      </dialog>
    </div>,
    document.getElementById("modal-root")!
  )
}
