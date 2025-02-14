import React from "react"

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
  colors = ["white", "lightblue", "skyblue", "deepskyblue", "white"]
}: CommonLoadingProps): React.ReactNode {
  return (
    <div className="loading-container flex justify-center items-center gap-2">
      {[...Array(count)].map((_, index) => (
        <svg
          key={index}
          viewBox="0 0 24 24"
          className="common-loading-heart-icon flex-shrink-0"
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
            d="M17.25 4a4.64 4.64 0 0 0-3.75 1.84A4.64 4.64 0 0 0 9.75 4 4.71 4.71 0 0 0 5 8.76c0 1.19.65 3.76 1.85 3.76a1 1 0 0 0 1-1c0-.65-.85-1.21-.85-2.76A2.73 2.73 0 0 1 9.75 6a2.81 2.81 0 0 1 2.77 2.49 1 1 0 0 0 2 0A2.81 2.81 0 0 1 17.25 6 2.73 2.73 0 0 1 20 8.76c0 2.58-2.91 4.91-6.5 8.21l-.57-.52-.8-.74a1 1 0 0 0-.68-.26 1 1 0 0 0-1 1 1 1 0 0 0 .32.74l.82.74c1.31 1.2 1.41 1.4 1.91 1.4a1 1 0 0 0 .68-.27C18.61 15 22 12.38 22 8.76A4.71 4.71 0 0 0 17.25 4zm-10 10a1.78 1.78 0 0 0-1.75 1.54A1.78 1.78 0 0 0 3.75 14 1.73 1.73 0 0 0 2 15.75c0 1.36 1.26 2.42 3.08 4.09a.63.63 0 0 0 .84 0C7.74 18.17 9 17.11 9 15.75A1.73 1.73 0 0 0 7.25 14z"
          />
        </svg>
      ))}
    </div>
  )
}
