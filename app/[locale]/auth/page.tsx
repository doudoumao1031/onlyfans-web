"use client"
import { checkPlatform } from "@/components/common/init"
import LoadingMask from "@/components/common/loading-mask"
import { locales, useRouter } from "@/i18n/routing"
import { useSearchParams } from "next/navigation"
import { useEffect, useRef } from "react"
export default function Page() {
  const search = useSearchParams()
  const router = useRouter()
  const redirectPath = search.get("redirect")

  const initialized = useRef(false)

  useEffect(() => {
    if (!initialized.current) {
      initialized.current = true
      const { isIOS, isAndroid } = checkPlatform()
      if (!isIOS && !isAndroid) {
        const localePattern = locales.join("|")
        const regex = new RegExp(`(\/(${localePattern})\/)+`, "g")
        const link = redirectPath ? `system/403?redirect=${redirectPath.replace(regex, "/")}` : "system/403"
        router.push(link)
      } else {
        window?.callAppApi("requestOAuth", "")
      }
    }
  }, [redirectPath, router])
  return <LoadingMask isLoading={true} />
}

