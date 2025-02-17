import { useState, useRef } from "react"

interface SwipeToDeleteProps {
  children: React.ReactNode
  onDelete: () => void
}

const SwipeToDelete: React.FC<SwipeToDeleteProps> = ({ children, onDelete }) => {
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const [isSwiping, setIsSwiping] = useState(false)
  const elementRef = useRef<HTMLDivElement>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX)
    setIsSwiping(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isSwiping) return

    const diff = e.touches[0].clientX - startX
    if (diff < 0) {
      // 只允许左滑
      setCurrentX(diff)
    }
  }

  const handleTouchEnd = () => {
    const width = elementRef.current?.offsetWidth || 350
    setIsSwiping(false)
    console.log(width, currentX)

    if (currentX < -width / 3) {
      // 滑动距离超过1/3时触发删除
      onDelete()
      setCurrentX(0) // 重置位置
    }

    if (currentX > -width / 3 && currentX < -100) {
      setCurrentX(-100)
    }
    if (currentX > -100) {
      setCurrentX(0) // 重置位置
    }
  }

  return (
    <div
      ref={elementRef}
      style={{
        transform: `translateX(${currentX}px)`,
        transition: isSwiping ? "none" : "transform 0.3s ease-out"
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative px-4"
    >
      {children}
      <div
        onTouchEnd={() => {
          onDelete()
          setCurrentX(0) // 重置位置
        }}
        className="absolute top-0 right-0 h-full flex items-center justify-center bg-rose-500 text-white"
        style={{
          width: "100px",
          transform: "translateX(100%)"
        }}
      >
        删除
      </div>
    </div>
  )
}

export default SwipeToDelete
