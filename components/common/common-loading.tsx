import React, { createContext } from "react"

interface CommonLoadingProps {
  count?: number
  size?: number
  speed?: number
  colors?: string[]
}

export default function CommonLoading({
  count = 5,
  size = 10,
  speed = 1.5,
  colors = ["#FFB6C1", "#FFB6C1", "#FFB6C1", "#FFB6C1", "#FFB6C1"]
}: CommonLoadingProps): React.ReactNode {
  return (
    <div className="loading-container flex items-center justify-center gap-2">
      {[...Array(count)].map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 24 24"
          className="common-loading-heart-icon shrink-0"
          style={{
            width: `${size}vw`,
            height: `${size}vw`,
            animationDuration: `${speed}s`,
            animationDelay: `${(index * speed) / count}s`,
            fill: colors[index % colors.length]
          }}
        >
          <path
            xmlns="http://www.w3.org/2000/svg"
            d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
          />
        </svg>
      ))}
    </div>
  )
}
