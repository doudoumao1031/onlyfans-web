"use client"
import { checkPlatform } from "@/components/common/init"
import LoadingMask from "@/components/common/loading-mask"
import { useRouter } from "@/i18n/routing"
import { useEffect } from "react"
export default function Page() {
  const router = useRouter()
  useEffect(() => {
    const { isIOS, isAndroid } = checkPlatform()
    if (!isIOS && !isAndroid) {
      router.push("/system/403")
    }
    window?.callAppApi("requestOAuth", "")
  }, [router])
  return (
    <LoadingMask isLoading={true} />
  )
}

