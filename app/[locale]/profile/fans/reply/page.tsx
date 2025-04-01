"use client"
import React, { useEffect, useState } from "react"


import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { useRouter } from "next/navigation"

import { useCommonMessageContext } from "@/components/common/common-message"
import LoadingMask from "@/components/common/loading-mask"
import Header from "@/components/profile/header"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import { getUserReply, ReplyForm, setUserReply, userProfile } from "@/lib/actions/profile"

const formValidation = z.object({
  sub_reply: z.string({ message: "请输入订阅回复" }).trim().min(1, "请输入订阅回复")
})


export default function Page() {
  const { showMessage } = useCommonMessageContext()
  const t = useTranslations("Profile.fans")
  const commonTrans = useTranslations("Common")
  const [originData, setOriginData] = useState<string>("")
  const [nickname, setNickname] = useState<string>("")
  const router = useRouter()
  const replyForm = useForm<ReplyForm>({
    mode: "all",
    resolver: zodResolver(formValidation)
  })
  useEffect(() => {
    getUserReply().then((data) => {
      const value = data?.data?.sub_reply ?? ""
      setOriginData(value)
      replyForm.setValue("sub_reply", value)
    })
    const profile = async () => {
      const response = await userProfile()
      const data = response?.data
      if (!data) {
        throw new Error()
      }
      setNickname(data.first_name + " " + data.last_name)
    }
    profile()
  }, [replyForm])

  const { isLoading, withLoading } = useLoadingHandler({
    onError: (message) => {
      showMessage(typeof message === "string" ? message : commonTrans("updateFail"))
    },
    onSuccess: (message) => {
      showMessage(typeof message === "string" ? message : commonTrans("updateSuccess"), "success", {
        afterDuration: router.back
      })
    }
  })

  const formSubmit = replyForm.handleSubmit(async (data) => {
    await withLoading(async () => {
      try {
        const response = await setUserReply(data)
        if (response?.code === 0) {
          return commonTrans("updateSuccess")
        }
        return new Error()
      } catch {
        throw commonTrans("updateFail")
      }
    })
  })

  return (
    <>
      <LoadingMask isLoading={isLoading} />
      <form onSubmit={formSubmit}>
        <Header title={t("msgReply")}
          right={<button type={"submit"} className={"text-text-theme text-base"}>{commonTrans("save")}</button>}
        />
        <section className={"px-4 py-5"}>
          {t("replyDescription")}：
        </section>
        <section className={"relative flex min-h-[120px] flex-col justify-end bg-[#90bb89] px-4 py-2"}>
          <div className={"relative min-h-5 rounded-2xl bg-white px-4 py-2"}>
            <div>{originData || t("replyExample", { nickname: nickname })}</div>
            <div className={"text-right text-[#b2b2b2]"}>9:00</div>
            <span className={"message-box-tail"}></span>
          </div>
        </section>
        <section className={"mt-5 px-4"}>
          <textarea {...replyForm.register("sub_reply")}
            className={"block w-full resize-none rounded-xl border border-[#ddd] p-4"}
            placeholder={t("replyExample", { nickname: nickname })} rows={4}
          />
          {replyForm.formState?.errors?.sub_reply?.message &&
            <div className={"text-theme text-xs"}>{replyForm.formState.errors.sub_reply.message}</div>}
        </section>
      </form>
    </>
  )
}