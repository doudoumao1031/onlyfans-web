"use client"

import React, { useState, useEffect, useRef } from "react"


import clsx from "clsx"
import { createPortal } from "react-dom"

import { useRouter } from "next/navigation"

export function SlideUpModal({
  children,
  portalId = "modal-root",
  full,
  closeBtn = true
}: {
    children: React.ReactNode,
    portalId?: string,
    full?: boolean,
    closeBtn?: boolean
}) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const sheetRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsOpen(true) // Trigger the enter animation when the component mounts
  }, [])

  function onDismiss() {
    setIsOpen(false) // Trigger the leave animation
    setTimeout(() => router.back(), 300) // Wait for the animation to finish before navigating back
  }

  const portalElement = document.getElementById(portalId) // Dynamic portal ID

  // Early return if portal element is not found
  if (!portalElement) {
    console.error(`Portal element with ID '${portalId}' not found`)
    return null
  }

  return createPortal(
    <div
      className={clsx(
        "fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 transition-opacity duration-300",
        isOpen ? "opacity-100" : "opacity-0"
      )}
      onTouchEnd={onDismiss}
    >
      <div
        className={clsx(
          "w-full max-w-lg rounded-t-lg bg-white shadow-lg transition-transform duration-300",
          isOpen ? "translate-y-0" : "translate-y-full",
          full ? "h-screen" : ""
        )}
        ref={sheetRef}
        onTouchEnd={(e) => e.stopPropagation()} // Prevent click propagation to the backdrop
      >
        {closeBtn && (
          <button
            onTouchEnd={onDismiss}
            className="absolute right-4 top-4 text-gray-500 hover:text-gray-800"
          >
            Close
          </button>
        )}
        {children}
      </div>
    </div>,
    portalElement
  )
}
