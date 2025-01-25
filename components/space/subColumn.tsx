"use client"
import { UserProfile } from "@/lib/actions/profile"
import SubscribedButton from "@/components/explore/subscribed-button"

export default function Page({ data }: { data: UserProfile | undefined }) {
  if (!data) return null
  return <SubscribedButton name={data.first_name} userId={Number(data.id)} subPrice={data.sub_price} type={"panel"} />
}
