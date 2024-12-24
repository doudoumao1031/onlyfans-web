'use client';

import React, {useState, useEffect, useRef} from 'react';
import {createPortal} from 'react-dom';
import {useRouter} from 'next/navigation';
import clsx from "clsx"
import ModalHeader from "@/components/common/modal-header";

export function SlideUpModal({
                                 children,
                                 portalId = 'modal-root',
                                 full,
                                 title,
                                 showPageHeader,
                                 headerRightControl,
                                 closeBtn = true,
                             }: {
    children: React.ReactNode,
    portalId?: string,
    showPageHeader?: boolean,
    title?: React.ReactNode,
    full?: boolean,
    headerRightControl?: (close: () => void) => React.ReactNode,
    closeBtn?: boolean
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
            className={clsx(
                "fixed inset-0 flex justify-center items-end bg-black bg-opacity-50 transition-opacity duration-300",
                isOpen ? 'opacity-100' : 'opacity-0'
            )}
            onTouchEnd={onDismiss}
        >
            <div
                className={clsx(
                    "bg-white w-full max-w-lg rounded-t-lg shadow-lg transform transition-transform duration-300",
                    isOpen ? 'translate-y-0' : 'translate-y-full',
                    full ? "h-[100vh]" : ""
                )}
                ref={sheetRef}
                onTouchEnd={(e) => e.stopPropagation()} // Prevent click propagation to the backdrop
            >
                {showPageHeader &&
                    <ModalHeader closeModal={onDismiss} title={title} right={headerRightControl?.(onDismiss)}/>}
                {!showPageHeader && closeBtn && <button
                    onTouchEnd={onDismiss}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
                >
                    Close
                </button>}
                {children}
            </div>
        </div>,
        portalElement
    );
}
