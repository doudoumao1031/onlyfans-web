'use client';

import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useRouter } from 'next/navigation';

export function SlideUpModal({ 
  children, portalId = 'modal-root' 
}: {
  children: React.ReactNode;
  portalId?: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const sheetRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsOpen(true); // Trigger the enter animation when the component mounts
  }, []);

  function onDismiss() {
    setIsOpen(false); // Trigger the leave animation
    setTimeout(() => router.back(), 300); // Wait for the animation to finish before navigating back
  }

  const portalElement = document.getElementById(portalId); // Dynamic portal ID

  // Early return if portal element is not found
  if (!portalElement) {
    console.error(`Portal element with ID '${portalId}' not found`);
    return null;
  }

  return createPortal(
    <div
      className={`fixed inset-0 flex justify-center items-end bg-black bg-opacity-50 transition-opacity duration-300 ${
        isOpen ? 'opacity-100' : 'opacity-50'
      }`}
      onClick={onDismiss}
    >
      <div
        className={`bg-white w-full max-w-lg rounded-t-lg shadow-lg transform transition-transform duration-300 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
        ref={sheetRef}
        onClick={(e) => e.stopPropagation()} // Prevent click propagation to the backdrop
      >
        {children}
        <button
          // onClick={onDismiss}
          onTouchEnd={onDismiss}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          Close
        </button>
      </div>
    </div>,
    portalElement
  );
}
