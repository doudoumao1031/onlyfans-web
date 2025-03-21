"use client"
import React, { useEffect, useMemo, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { clsx } from "clsx"
import dayjs from "dayjs"
import { useTranslations } from "next-intl"
import { Line } from "react-chartjs-2"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import useCommonMessage, {
  CommonMessageContext,
  useCommonMessageContext
} from "@/components/common/common-message"
import FormDrawer from "@/components/common/form-drawer"
import Header from "@/components/common/header"
import LoadingMask from "@/components/common/loading-mask"
import { options } from "@/components/profile/chart-line"
import IconWithImage from "@/components/profile/icon"
import { Input } from "@/components/ui/input"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import { Link, useRouter } from "@/i18n/routing"
import {
  addWalletDownOrder,
  getUserMetricDay,
  getUserStatIncome,
  UserMetricDay,
  userWallet,
  WalletInfo
} from "@/lib"
import { ZH_YYYY_MM_DD } from "@/lib/constant"
import { getDateRange, getEvenlySpacedPoints } from "@/lib/utils"

const Withdrawal = ({
  children,
  info
}: {
  children: React.ReactNode
  info: WalletInfo
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
      showMessage(t("withdrawalAmountSuccess"), "success", {
        afterDuration: () => {
          router.push("/profile/withdraw")
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
              <button className={"text-text-theme text-base"}>{t("withdrawalAmountDetail")}</button>
            </Link>
          )
        }}
        className="border-0"
        handleSubmit={(event) => {
          event.preventDefault()
        }}
      >
        <div className="p-8">
          <div className="mt-4 grid grid-cols-2">
            <div className="flex flex-col items-center">
              <span className="mb-2 text-xs">{t("withdrawalAmountAvailable")}</span>
              <span className="text-[20px]">{info.amount - (info?.freeze ?? 0)} USDT</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="mb-2 text-xs">{t("withdrawalAmountFreeze")}</span>
              <span className="text-[20px]">{info.freeze} USDT</span>
            </div>
          </div>
          <div className="relative mt-10 flex items-center justify-between">
            <span className="text-base font-bold">{t("withdrawal")}</span>
            <span className="flex flex-1 items-center justify-end">
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
                      className="w-16 flex-1 border-0 text-right"
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
          <div className="mt-10 flex justify-center">
            <button
              disabled={!!errorMessage}
              type={"button"}
              onTouchEnd={() => {
                withdrawalForm.trigger().then(async (valid) => {
                  if (valid) {
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
                  }
                })
              }}
              className={clsx(
                "flex h-12 w-full items-center justify-center rounded-full text-white transition-all ",
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

type UserMetricDayReq = {
  start: string
  end: string
}

function ChartData({ params }: { params: UserMetricDayReq }) {
  const [data, setData] = useState<Array<UserMetricDay>>()
  useEffect(() => {
    getUserMetricDay(params).then((response) => {
      if (response) {
        const result = getEvenlySpacedPoints<UserMetricDay>((response.list || []).reverse())
        setData(result)
      }
    })
  }, [params])

  const lineData = useMemo(() => {
    return {
      labels: !data?.length ? getDateRange(params as { start: string, end: string }) : data?.map((item) => item.day),
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
        start: now.add(-7, "day").format(ZH_YYYY_MM_DD),
        end: now.format(ZH_YYYY_MM_DD)
      }
    },
    {
      label: t("recent15Days"),
      value: {
        start: now.add(-15, "day").format(ZH_YYYY_MM_DD),
        end: now.format(ZH_YYYY_MM_DD)
      }
    },
    {
      label: t("recent30Days"),
      value: {
        start: now.add(-30, "day").format(ZH_YYYY_MM_DD),
        end: now.format(ZH_YYYY_MM_DD)
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
        start: now.format(ZH_YYYY_MM_DD),
        end: now.format(ZH_YYYY_MM_DD)
      }
    },
    {
      label: t("recent30Days"),
      key: 1,
      value: {
        start: now.add(-30, "day").format(ZH_YYYY_MM_DD),
        end: now.format(ZH_YYYY_MM_DD)
      }
    },
    {
      label: t("recent1Year"),
      key: 2,
      value: {
        start: now.add(-1, "year").format(ZH_YYYY_MM_DD),
        end: now.format(ZH_YYYY_MM_DD)
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
      <div className="flex h-screen w-full flex-col items-center justify-start overflow-auto">
        <div className="w-full">
          <Header title={t("incomeCenter")} titleColor="#000" />
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
                  className={`border-theme mr-3 flex h-8 items-center justify-center rounded-full border px-4 ${active.start === v.value.start ? "bg-theme text-white" : "text-text-theme "
                }`}
                >
                  {v.label}
                </button>
          ))}
            </div>
            <div className="flex items-end justify-center p-6 pt-0">
              <span className="text-[32px] font-medium">{walletInfo?.amount}</span>
              <span className="ml-2 pb-1 text-[18px] text-[#777]">USDT</span>
            </div>
            <div className="mb-5 mt-2 flex items-center justify-between px-4">
              <span className="text-xs">
                <span className="text-[#777] ">{currentLabel}</span>
                <span className="text-text-theme ml-2">+{inCome}</span>
              </span>
              {walletInfo && (
              <Withdrawal info={walletInfo} >
                <span className="flex text-xs">
                  <span className="text-[#777] ">{t("withdrawalAmountAvailable")}</span>
                  <span className="mx-2">
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
            <div className="flex items-center justify-between border-t  border-[#DDDDDD] px-4 pt-5 text-base">
              <span className="font-bold">{t("incomeTrend")}</span>
              <Link href={"/profile/revenue"} className="flex items-center">
                <span className="text-theme mx-2 text-[12px]">
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
            <div className="flex p-4">
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
        </div>
      </div>
    </>
  )
}
