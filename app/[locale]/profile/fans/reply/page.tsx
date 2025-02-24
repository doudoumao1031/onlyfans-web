"use client"
import Header from "@/components/profile/header"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { getUserReply, ReplyForm, setUserReply } from "@/lib/actions/profile"
import React, { useEffect, useState } from "react"
import { useCommonMessageContext } from "@/components/common/common-message"
import { useRouter } from "next/navigation"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import LoadingMask from "@/components/common/loading-mask"
// import { ReplyForm, setReply } from "@/lib/data"


const formValidation = z.object({
  sub_reply: z.string({ message: "请输入订阅回复" }).min(1, "请输入订阅回复")
})


export default function Page() {
  const { showMessage } = useCommonMessageContext()
  const [originData, setOriginData] = useState<string>("")
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
  }, [replyForm])

  const { isLoading, withLoading } = useLoadingHandler({
    onError: (message) => {
      showMessage(typeof message === "string" ? message : "保存失败")
    },
    onSuccess: (message) => {
      showMessage(typeof message === "string" ? message : "保存成功", "success", {
        afterDuration: router.back
      })
    }
  })

  const formSubmit = replyForm.handleSubmit(async (data) => {
    await withLoading(async () => {
      try {
        const response = await setUserReply(data)
        if (response?.code === 0) {
          return "修改成功"
        }
        return new Error()
      } catch {
        throw "修改失败"
      }
    })
  })

  return (
    <>
      <LoadingMask isLoading={isLoading} />
      <form onSubmit={formSubmit}>
        <Header title={"订阅回复"}
          right={<button type={"submit"} className={"text-text-pink text-base"}>保存</button>}
        />
        <section className={"py-5 px-4"}>
          用户成功订阅后，将会对用户发起一条问候信息：
        </section>
        <section className={"min-h-[120px] bg-[#90bb89] relative py-2 px-4 flex flex-col justify-end"}>
          <div className={"bg-white relative min-h-5 px-4 py-2 rounded-2xl"}>
            <div>{originData}</div>
            <div className={"text-right text-[#b2b2b2]"}>9:00</div>
            <span className={"message-box-tail"}></span>
          </div>
        </section>
        <section className={"mt-5 px-4"}>
          <textarea {...replyForm.register("sub_reply")}
            className={"resize-none p-4 border border-[#ddd] block w-full rounded-xl"}
            placeholder={"Hi，我是用户的昵称，感谢您的订阅"} rows={4}
          />
          {replyForm.formState?.errors?.sub_reply?.message &&
            <div className={"text-xs text-pink"}>{replyForm.formState.errors.sub_reply.message}</div>}
        </section>
      </form>
    </>
  )
}