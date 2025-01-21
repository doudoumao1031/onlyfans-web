"use client"
import FormDrawer from "@/components/common/form-drawer"
import IconWithImage from "@/components/profile/icon"
import { useState } from "react"
import { addWalletOrder, handleRechargeOrderCallback } from "@/lib"
import useCommonMessage from "@/components/common/common-message"
import Link from "next/link"
import { usePathname } from "next/navigation"
import Modal from "@/components/space/modal"

const RechargeDrawer: React.FC = () => {
  const pathname = usePathname()
  const { showMessage, renderNode } = useCommonMessage()
  const [amount, setAmount] = useState<number>(0)
  const [ptBalance, setPtBalance] = useState<number>(0)
  const [wfBalance, setWfBalance] = useState<number>(0)
  const [rate, setRate] = useState<string>("1:1")



  const getSettingData = async () => {
    // todo: 充值配置、pt钱包余额、比例等信息
    setPtBalance(100)
    setWfBalance(6)
    console.log("init data:", ptBalance, wfBalance, rate)
  }
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false)

  const columns:{title: string, desc: string}[] = [
    { title: "服务", desc: "唯粉充值" },
    { title: "钱包余额", desc: ptBalance.toFixed(2).toString() + " USDT" },
    { title: "唯粉余额", desc: wfBalance.toFixed(2).toString() + " USDT" },
    { title: "总的比例", desc: rate }
  ]


  async function handleRecharge(amount: number) {
    if (amount <= 0) {
      showMessage(<div className={"w-36 h-12 flex justify-center items-center"}>
        <IconWithImage url={"/icons/checkbox_select_white@3x.png"} height={20} width={20}/>
        <span className={"text-white font-medium"}>请输入充值金额</span>
      </div>)
      return
    }
    const tradeNo = await addWalletOrder({ amount: Number(amount) })
      .then((result) => {
        if (result && result.code === 0) {
          return result.data.trade_no
        }
        throw Error()
      })
    console.log("tradeNo:", tradeNo)
    // todo: 调用pt钱包支付
    await handleRechargeOrderCallback({ trade_no: tradeNo })
      .then((result) => {
        if (result && result.code === 0) {
          showMessage(<div className={"w-36 h-12 flex justify-center items-center"}>
            <IconWithImage url={"/icons/checkbox_select_white@3x.png"} height={20} width={20}/>
            <span className={"text-white font-medium"}>充值成功</span>
          </div>)
        } else {
          showMessage(<div className={"w-36 h-12 flex justify-center items-center"}>
            <IconWithImage url={"/icons/checkbox_select_white@3x.png"} height={20} width={20}/>
            <span className={"text-white font-medium text-base"}>充值失败</span>
          </div>)
        }
      })
  }

  return (
    <>
      {renderNode}
      <FormDrawer
        title={<span className={"text-[18px] font-semibold"}>充值</span>}
        headerLeft={(close) => {
          return (
            <button onTouchEnd={close} className={"text-base text-[#777]"}>
              <IconWithImage url={"/icons/profile/icon_close@3x.png"} width={24} height={24} color={"#000"} />
            </button>
          )
        }}
        headerRight={(() => {
          return (
            <Link href={`${pathname}/income/withdrawalInfo`}>
              <button className={"text-base text-main-pink"}>明细</button>
            </Link>
          )
        })}
        trigger={
          <button className={"rounded-full border border-white text-center px-[20px] p-[6px] text-white"}
            onClick={() => {
              getSettingData()
              setDrawerOpen(true)
            }}
          >充值</button>
        }
        className="h-[50vh] border-0"
        setIsOpen={setDrawerOpen}
        isOpen={drawerOpen}
      >
        <div className="h-[50vh] w-full flex flex-col items-center text-black text-2xl bg-slate-50">
          <div className={"rounded-xl p-4 w-full text-base"}>
            {columns.map((item, index) => (
              <div key={index} className={`flex justify-between px-4 py-[13px] items-center bg-white 
              ${index < columns.length - 1 && "border-b border-gray-200"}
              ${index == 0 && "rounded-t-xl"} 
              ${index == columns.length - 1 && "rounded-b-xl"} 
              `}
              >
                <span className={"font-medium"}>{item.title}</span>
                <span className={"text-gray-400 font-normal"}>{item.desc}</span>
              </div>
            )
            )}
          </div>
          <div className="w-full flex items-center px-4 relative">
            <input id="amount"
              type="number"
              className="w-full py-2 pl-4 pr-16 border-0 bg-white rounded-lg text-left h-[49px] placeholder:text-gray-400 text-base"
              placeholder="请输入充值金额"
              value={amount == 0 ? "" : amount.toString()}
              onChange={(event) => {
                const money = event.target.value.replace(/[^0-9.]/g, "")
                setAmount(parseFloat(money) || 0)
              }}
              onBlur={(event) => {
                const formattedAmount = parseFloat(event.target.value).toFixed(2)
                setAmount(parseFloat(formattedAmount))
              }}
            />
            <button
              className="absolute right-6 top-1/2 transform -translate-y-1/2 font-normal text-main-pink text-base"
              onTouchEnd={(e) => {
                e.preventDefault()
                setAmount(parseFloat(ptBalance.toFixed(2)))
              }}
            >
              全部
            </button>
          </div>
          <div className="my-[40px] self-center">
            <button
              disabled={amount === 0}
              className="w-[295px] h-[49px] p-2 bg-main-pink text-white text-base font-medium rounded-full"
              onTouchEnd={(e) => {
                e.preventDefault()
                handleRecharge(amount)
              }}
            >确认充值
            </button>
          </div>
        </div>
      </FormDrawer>
    </>
  )
}

export default RechargeDrawer