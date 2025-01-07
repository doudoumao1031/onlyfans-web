"use client"
import Header from "@/components/profile/header";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {ReplyForm, setReply} from "@/lib/data";


const formValidation = z.object({
    sub_reply: z.string({message: "请输入订阅回复"})
})


export default function Page() {
    const replyForm = useForm<ReplyForm>({
        mode: "all",
        resolver: zodResolver(formValidation),
    })
    const formSubmit = replyForm.handleSubmit((data) => {
        setReply(data).then((response) => {
            console.log(response)
        })
    })
    return <form onSubmit={formSubmit}>
        <Header title={"订阅回复"}
                right={<button type={"submit"} className={"text-main-pink text-base"}>保存</button>}/>
        <section className={"py-5 px-4"}>
            用户成功订阅后，将会对用户发起一条问候信息：
        </section>
        <section className={"min-h-[120px] bg-[#90bb89] relative py-2 px-4 flex flex-col justify-end"}>
            <div className={"bg-white relative min-h-5 px-4 py-2 rounded-2xl"}>
                <div>Hi，我是用户的昵称，感谢您的订阅</div>
                <div className={"text-right text-[#b2b2b2]"}>9:00</div>
                <span className={"message-box-tail"}></span>
            </div>
        </section>
        <section className={"mt-5 px-4"}>
            <textarea {...replyForm.register("sub_reply")}
                      className={"resize-none p-4 border border-[#ddd] block w-full rounded-xl"}
                      placeholder={"Hi，我是 用户的昵称，感谢您的订阅"} rows={4}/>
        </section>
        {replyForm.formState?.errors?.sub_reply?.message &&
          <div className={"text-xs text-red-600"}>{replyForm.formState.errors.sub_reply.message}</div>}
    </form>
}