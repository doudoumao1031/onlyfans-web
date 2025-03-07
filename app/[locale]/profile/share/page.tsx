import QrCodeHeader from "@/components/profile/qrcode-header"
import { userProfile } from "@/lib/actions/profile"

export default async function Page() {
  const response = await userProfile()
  const data = response?.data
  if (!data) {
    throw new Error()
  }
  return (
    <div>
      <QrCodeHeader data={data} />
    </div>
  )
}
