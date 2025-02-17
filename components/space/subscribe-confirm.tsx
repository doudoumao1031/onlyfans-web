"use client"
import { useState } from "react"
import FormDrawer from "../common/form-drawer"
import IconWithImage from "../profile/icon"
import { UserProfile } from "@/lib/actions/profile"

export type TFeeItem = {
  month: number
  price: number
  discount?: number
  percentage?: string
}

const mockPrices: TFeeItem[] = [
  {
    month: 1,
    price: 99.99
  },
  {
    month: 3,
    price: 999.99,
    discount: 90.9,
    percentage: "90%"
  },
  {
    month: 99,
    price: 9999.99,
    discount: 999.0,
    percentage: "90%"
  }
]
export default function SubScribeConfirm({
  data,
  children,
  isOpen,
  setIsOpen
}: {
  data: UserProfile | undefined
  children: React.ReactNode
  isOpen?: boolean
  setIsOpen?: (val: boolean) => void
}) {
  const [active, setActive] = useState<number>(0)
  // const [infos, setInfos] = useState<UserProfile | undefined>(data)
  // useEffect(() => {
  //     if (!data) return
  //     setInfos(data)

  // }, [data])
  const openInner = () => {
    return (
      <div className="py-8 px-4 pb-20">
        <div className="flex justify-between items-center ">
          {mockPrices.map((v, i) => {
            return (
              <div
                onClick={() => setActive(i)}
                key={i}
                className={`relative w-[32%] h-36 rounded-lg border-border-pink flex flex-col justify-center items-center ${
                  active === i && "border"
                }`}
              >
                <span
                  className={`text-xs text-[#6D7781] ${active === i && "text-[#222222]"}`}
                >{`${v.month}个月`}</span>
                <span
                  className={`text-[20px] font-bold my-4] ${
                    active === i ? "text-text-pink" : "text-[#222222"
                  }`}
                >{`$${v.price}`}</span>
                <span className="text-[#6D7781] text-xs">{v.discount ? `$${v.discount}` : ""}</span>
                {v.percentage && (
                  <div className=" flex justify-center items-center absolute left-0 top-0 w-1/2 h-[18px] mt-[-9px] bg-[#F7B500] rounded-full rounded-bl-none text-xs text-white">{`${v.percentage} off`}</div>
                )}
              </div>
            )
          })}
        </div>
        <div className="flex justify-center">
          <div className=" relative w-72 h-[50px] rounded-full bg-background-pink text-white flex justify-center items-center mt-10 text-[15px] font-semibold">
            确认并支付 999.99 USDT
            <div className=" absolute top-[-14px] right-6 py-1 px-2 bg-[#F7B500] flex justify-center items-center text-xs rounded-full">
              已省 $99.99
            </div>
          </div>
        </div>
      </div>
    )
  }
  return (
    <FormDrawer
      title={
        <div>
          订阅 <span className="ml-1 text-[15px] text-text-pink">{data?.first_name}</span>
        </div>
      }
      headerLeft={(close) => {
        return (
          <button onTouchEnd={close} className={"text-base text-[#777]"}>
            <IconWithImage
              url={"/icons/profile/icon_close@3x.png"}
              width={24}
              height={24}
              color={"#000"}
            />
          </button>
        )
      }}
      trigger={children}
      outerControl={setIsOpen ? true : false}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      className="h-[50vh] border-0"
    >
      {openInner()}
    </FormDrawer>
  )
}
