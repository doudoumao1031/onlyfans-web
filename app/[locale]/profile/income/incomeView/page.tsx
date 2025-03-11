"use client"
import IconWithImage from "@/components/profile/icon"
import React, { useEffect, useMemo, useState } from "react"
import { options } from "@/components/profile/chart-line"
import FormDrawer from "@/components/common/form-drawer"
import { Input } from "@/components/ui/input"
import { Line } from "react-chartjs-2"
import {
  addWalletDownOrder,
  getUserMetricDay,
  getUserStatIncome,
  UserMetricDay,
  userWallet,
  WalletInfo
} from "@/lib"
import dayjs from "dayjs"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import useCommonMessage, {
  CommonMessageContext,
  useCommonMessageContext
} from "@/components/common/common-message"
import { getEvenlySpacedPoints } from "@/lib/utils"
import { clsx } from "clsx"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import LoadingMask from "@/components/common/loading-mask"
import { Link, useRouter } from "@/i18n/routing"
import { useTranslations } from "next-intl"

const Withdrawal = ({
  children,
  info,
  refresh
}: {
  children: React.ReactNode
  info: WalletInfo
  refresh: () => void
}) => {
  const t = useTranslations("Profile.income")
  const schemas = useMemo(() => {
    return z.object({
      amount: z
        .string({ message: t("withdrawalAmount") })
        .refine((data) => Number(data) > 0.01, { message: t("withdrawalAmountError") })
        .refine((data) => Number(data) <= info.amount - (info?.freeze ?? 0), {
          message: t("withdrawalAmountMax")
        })
    })
  }, [info.amount, info?.freeze, t])
  const withdrawalForm = useForm<{ amount: string }>({
    mode: "all",
    defaultValues: {
      amount: undefined
    },
    resolver: zodResolver(schemas)
  })

  const [openState, setOpenState] = useState<boolean>(false)
  const { showMessage } = useCommonMessageContext()
  const router = useRouter()

  useEffect(() => {
    if (openState) {
      withdrawalForm.reset()
    }
  }, [openState, withdrawalForm])

  const errorMessage = withdrawalForm.formState.errors.amount?.message

  useEffect(() => {
    if (openState) {
      withdrawalForm.trigger("amount")
    }
  }, [openState, withdrawalForm])

  const { isLoading, withLoading } = useLoadingHandler({
    onError: () => {
      showMessage(t("withdrawalAmountFailed"))
    },
    onSuccess: () => {
      setOpenState(false)
      showMessage(t("withdrawalAmountSuccess"), "success",{
        afterDuration: () => {
          router.push("/profile/statement?changeType=5")
        }
      })
    }
  })

  const amount = withdrawalForm.watch("amount")

  return (
    <>
      <button
        onTouchEnd={() => {
          setOpenState(true)
        }}
      >
        {children}
      </button>
      <LoadingMask isLoading={isLoading} />
      <FormDrawer
        trigger={children}
        isAutoHeight
        isOpen={openState}
        setIsOpen={setOpenState}
        outerControl={true}
        title={t("withdrawal")}
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
        headerRight={() => {
          return (
            <Link href={"/profile/withdraw"}>
              <button className={"text-base text-text-theme"}>{t("withdrawalAmountDetail")}</button>
            </Link>
          )
        }}
        className="border-0"
        handleSubmit={(event) => {
          event.preventDefault()
        }}
      >
        <div className="p-8">
          <div className="flex justify-between mt-4">
            <div className="flex flex-col items-center">
              <span className="text-xs text-[#222] mb-2">{t("withdrawalAmountAvailable")}</span>
              <span className="text-[20px]">{info.amount - (info?.freeze ?? 0)} USDT</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="text-xs text-[#777] mb-2">{t("withdrawalAmountFreeze")}</span>
              <span className="text-[20px]">{info.freeze} USDT</span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-10 relative">
            <span className="font-bold text-base">{t("withdrawal")}</span>
            <span className="flex items-center flex-1 justify-end">
              <Controller
                control={withdrawalForm.control}
                render={({ field }) => {
                  return (
                    <Input
                      style={{
                        boxShadow: "none"
                      }}
                      value={field.value || ""}
                      onChange={field.onChange}
                      onBlur={(event) => {
                        const value = event.target.value
                        let numberValue = Number(value)
                        if (isNaN(numberValue)) {
                          numberValue = 0
                        }
                        if (value) {
                          field.onChange((numberValue).toFixed(2))
                        }
                      }}
                      placeholder="0.00"
                      className="border-0 w-16 text-[#BBB] flex-1 text-right"
                    />
                  )
                }}
                name={"amount"}
              />
              <span>USDT</span>
            </span>
            {/*<section className={"absolute bottom-[-12px] text-theme text-xs"}>*/}
            {/*  {withdrawalForm.formState.errors?.amount?.message}*/}
            {/*</section>*/}
          </div>
          <div className="flex justify-center mt-10">
            <button
              disabled={!!errorMessage}
              type={"button"}
              onTouchEnd={async () => {
                await withLoading(async () => {
                  const response = await addWalletDownOrder({
                    amount: Number(amount)
                  })
                  if (response?.code === 0) {
                    return true
                  } else {
                    throw Error
                  }
                })
              }}
              className={clsx(
                "w-full transition-all h-12 rounded-full text-white flex justify-center items-center ",
                !!errorMessage ? "bg-[#ddd]" : "bg-background-theme "
              )}
            >
              {errorMessage ? errorMessage : t("withdrawal")}
            </button>
          </div>
        </div>
      </FormDrawer>
    </>
  )
}

const DATE_FORMAT = "YYYY-MM-DD"

type UserMetricDayReq = {
  start: string
  end: string
}

function ChartData({ params }: { params: UserMetricDayReq }) {
  const [data, setData] = useState<Array<UserMetricDay>>()
  useEffect(() => {
    getUserMetricDay(params).then((response) => {
      if (response) {
        const result = getEvenlySpacedPoints<UserMetricDay>(response.list.reverse())
        setData(result)
      }
    })
  }, [params])

  const lineData = useMemo(() => {
    return {
      labels: data?.map((item) => item.day),
      datasets: [
        {
          label: "播放量",
          data: data?.map((item) => item.income),
          borderColor: "#00AEF3",
          backgroundColor: "rgba(0,174,243,0.2)",
          yAxisID: "y"
        }
      ]
    }
  }, [data])
  return <Line options={options} data={lineData} />
}

export default function Page() {
  const t = useTranslations("Profile.income")
  const now = dayjs()
  const dateTabs: Array<{ label: string; value: UserMetricDayReq }> = [
    {
      label: t("recent7Days"),
      value: {
        start: now.add(-7, "day").format(DATE_FORMAT),
        end: now.format(DATE_FORMAT)
      }
    },
    {
      label: t("recent15Days"),
      value: {
        start: now.add(-15, "day").format(DATE_FORMAT),
        end: now.format(DATE_FORMAT)
      }
    },
    {
      label: t("recent30Days"),
      value: {
        start: now.add(-30, "day").format(DATE_FORMAT),
        end: now.format(DATE_FORMAT)
      }
    }
  ]
  const [dateActive, setDateActive] = useState<UserMetricDayReq>(dateTabs[0].value)
  const [activeKey, setActiveKey] = useState<number>(0)
  const currentLabel = useMemo(() => {
    return [t("today"), t("diff30Days"), t("diff1Year")].at(activeKey)
  }, [activeKey, t])
  const tabs: Array<{ label: string; key: number; value: UserMetricDayReq }> = [
    {
      label: t("today"),
      key: 0,
      value: {
        start: now.format(DATE_FORMAT),
        end: now.format(DATE_FORMAT)
      }
    },
    {
      label: t("recent30Days"),
      key: 1,
      value: {
        start: now.add(-30, "day").format(DATE_FORMAT),
        end: now.format(DATE_FORMAT)
      }
    },
    {
      label: t("recent1Year"),
      key: 2,
      value: {
        start: now.add(-1, "year").format(DATE_FORMAT),
        end: now.format(DATE_FORMAT)
      }
    }
  ]

  const [active, setActive] = useState<UserMetricDayReq>(tabs[0].value)
  const [inCome, setIncome] = useState<number>(0)
  useEffect(() => {
    getUserStatIncome(active).then((data) => {
      if (data !== null) {
        setIncome(data)
      }
    })
  }, [active])

  const [walletInfo, setWalletInfo] = useState<WalletInfo>()

  const refreshWalletInfo = () => {
    userWallet().then((response) => {
      if (response?.code === 0) {
        setWalletInfo(response.data)
      }
    })
  }

  useEffect(() => {
    refreshWalletInfo()
  }, [])

  const { showMessage, renderNode } = useCommonMessage()


  return (
    <>
      <CommonMessageContext.Provider value={useMemo(() => ({ showMessage }), [showMessage])}>
        {renderNode}
        <div className="flex p-4">
          {tabs.map((v) => (
            <button
              type={"button"}
              onTouchEnd={() => {
                setActive(v.value)
                setActiveKey(v.key)
              }}
              key={v.value.start}
              className={`h-8 px-4 flex justify-center items-center border border-theme rounded-full mr-3 ${active.start === v.value.start ? "bg-theme text-white" : "text-text-theme "
                }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div className="p-6 pt-0 flex justify-center items-end">
          <span className="text-[32px] font-medium">{walletInfo?.amount}</span>
          <span className="text-[18px] text-[#777] ml-2 pb-1">USDT</span>
        </div>
        <div className="pl-4 pr-4 flex justify-between items-center mt-2 mb-5">
          <span className="text-xs">
            <span className="text-[#777] ">{currentLabel}</span>
            <span className="text-text-theme ml-2">+{inCome}</span>
          </span>
          {walletInfo && (
            <Withdrawal info={walletInfo} refresh={refreshWalletInfo}>
              <span className="text-xs flex">
                <span className="text-[#777] ">{t("withdrawalAmountAvailable")}</span>
                <span className="ml-2 mr-2">
                  {Number(walletInfo?.amount) - (walletInfo?.freeze ?? 0)}
                </span>
                <span>
                  <IconWithImage
                    url="/icons/profile/icon-r.png"
                    width={14}
                    color="#BBB"
                    height={14}
                  />
                </span>
              </span>
            </Withdrawal>
          )}
        </div>
        <div className="px-4 pt-5 border-t border-[#DDDDDD]  text-base flex justify-between items-center">
          <span className="font-bold">{t("incomeTrend")}</span>
          <Link href={"/profile/revenue"} className="flex items-center">
            <span className="ml-2 mr-2 text-theme text-[12px]">
              收益明细
            </span>
            <IconWithImage
              url="/icons/profile/icon-r.png"
              width={14}
              color="#00aef3"
              height={14}
            />
          </Link>
        </div>
        <div className="p-4 flex">
          <span className="mr-8">{t("incomeTime")}</span>
          {dateTabs.map((v, index) => (
            <button
              type={"button"}
              onClick={() => {
                setDateActive(v.value)
              }}
              key={index}
              className={`mr-8 text-[#bbb] ${dateActive.start === v.value.start ? "text-text-theme" : ""
                }`}
            >
              {v.label}
            </button>
          ))}
        </div>
        <div className="p-4">
          <ChartData params={dateActive} />
        </div>
      </CommonMessageContext.Provider>
    </>
  )
}
