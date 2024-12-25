"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import {cva, type VariantProps} from "class-variance-authority"

import {cn} from "@/lib/utils"

const toggleVariants = cva(
    "hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 data-[state=on]:bg-rose-100 data-[state=on]:text-black [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
    {
        variants: {
            variant: {
                default: "bg-white rounded-lg",
                outline: "bg-white rounded-lg data-[state=on]:text-main-pink",
            },
            size: {
                default: "h-36 w-[30%]",
                sm: "h-8 px-1.5 min-w-8",
                lg: "h-10 px-2.5 min-w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const ToggleSubscribed = React.forwardRef<
    React.ElementRef<typeof TogglePrimitive.Root>,
    React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
    VariantProps<typeof toggleVariants>
>(({className, variant, size, ...props}, ref) => (
    <TogglePrimitive.Root
        ref={ref}
        className={cn(toggleVariants({variant, size, className}))}
        {...props}
    />
))

ToggleSubscribed.displayName = TogglePrimitive.Root.displayName

export {ToggleSubscribed, toggleVariants}
