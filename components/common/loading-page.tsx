import Image from "next/image"

interface LoadingPageProps {
  height?: string
}
export default function LoadingPage(props: LoadingPageProps) {
  const { height } = props
  return (
    <div className={`flex items-center justify-center pt-4 ${height ? height : "h-screen"}`}>
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