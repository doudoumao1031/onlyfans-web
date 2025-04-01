"use client"
import React, { useEffect, useMemo } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import { clsx } from "clsx"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import {
  useCommonMessageContext
} from "@/components/common/common-message"
import FormDrawer from "@/components/common/form-drawer"
import LoadingMask from "@/components/common/loading-mask"
import IconWithImage from "@/components/profile/icon"
import { Input } from "@/components/ui/input"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import { Link, useRouter } from "@/i18n/routing"
import {
  addWalletDownOrder,
  WalletInfo
} from "@/lib"

interface WithdrawDrawerProps {
  children: React.ReactNode
  info: WalletInfo
  isOpen: boolean
  setIsOpen: (val: boolean) => void
}

export default function WithdrawDrawer(props: WithdrawDrawerProps) {
  const { children, info, isOpen, setIsOpen } = props
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

  const { showMessage } = useCommonMessageContext()
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      withdrawalForm.reset()
    }
  }, [isOpen, withdrawalForm])

  const errorMessage = withdrawalForm.formState.errors.amount?.message

  useEffect(() => {
    if (isOpen) {
      withdrawalForm.trigger("amount")
    }
  }, [isOpen, withdrawalForm])

  const { isLoading, withLoading } = useLoadingHandler({
    onError: () => {
      showMessage(t("withdrawalAmountFailed"))
    },
    onSuccess: () => {
      setIsOpen(false)
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
          setIsOpen(true)
        }}
      >
        {children}
      </button>
      <LoadingMask isLoading={isLoading} />
      <FormDrawer
        trigger={children}
        isAutoHeight
        isOpen={isOpen}
        setIsOpen={setIsOpen}
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
              <span className="text-xl">{info.amount - (info?.freeze ?? 0)} USDT</span>
            </div>
            <div className="flex flex-col items-center">
              <span className="mb-2 text-xs">{t("withdrawalAmountFreeze")}</span>
              <span className="text-xl">{info.freeze} USDT</span>
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
                !!errorMessage ? "bg-[#ddd]" : "bg-theme "
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