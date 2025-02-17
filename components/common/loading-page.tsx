import Image from "next/image"

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative w-16 h-16">
        <Image
          src="/icons/loading1.png"
          alt="loading"
          className="animate-spin"
          fill
          sizes="4rem"
          priority
        />
      </div>
    </div>
  )
}