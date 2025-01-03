import {z} from "zod";
import {postData} from "@/lib/data";

export interface iPostAttachment {
    file_id: string,
    id?: string
}

export enum iPostUserType {
    ALL = "0", // 所有
    SUB = "1", //订阅
    UNSUB = "2" // 非订阅
}

type iPostVoteItem = {
    content: string
    id?: number
}

export interface iPostVote {
    id?: number,
    items: iPostVoteItem[],
    mu_select: boolean,
    stop_time: number // timestamp
    title?: string // min 2
}

export interface iPostPrice {
    id?: number,
    price?: number // 0-999,
    user_type: iPostUserType
    visibility: boolean,
}

export interface iPost {
    post: {
        notice: boolean, //通知
        title: string, // 标题
        id?: number
    },
    post_attachment?: iPostAttachment[], //帖子附件
    post_price?: iPostPrice[] // 帖子价格
    post_vote?: iPostVote
}

export const postVoteValidation =  z.object({
    id: z.string().optional(),
    items: z.array(z.object({
        content: z.string().optional(),
    }).required()).min(2, "最少两个选项"),
    mu_select: z.boolean(),
    stop_time: z.union([z.number().min(0, "请选择结束时间"),z.string().min(1, "请选择结束时间")]),
    title: z.string({message: "请输入投票标题"}).min(2,"标题最少2个字")
})

export const postPriceValidation = z.array(z.object({
    id: z.string().optional(),
    price: z.number().max(999, '不能大于999').min(0, "不能小于0").optional(),
    user_type: z.enum(["0", "1", "2"]),
    visibility: z.boolean()
}))

export const postValidation = z.object({
    post: z.object({
        id: z.number().optional(),
        notice: z.boolean(),
        title: z.string({message: "请输入标题"}).min(2, '最少两个字').max(999, '最多999个字')
    }),
    post_attachment: z.array(z.object({
        file_id: z.string(),
        id: z.string().optional()
    })).optional(),
    post_price: postPriceValidation.min(1),
    post_vote: postVoteValidation.optional()
})


export const addPost = (data: iPost) => postData("/post/add", data)