export type User = {
    // 昵称
    first_name: string,
    username: string,
    id: string,
    // 头像
    photo: string,
    // 背景图
    back_img: string,
    // 直播认证 0 未认证、1 已认证
    live_certification: boolean,
    // 是否博主
    blogger: boolean,
    status: number,
    pt_user_id: number,
    location: string,
    about: string,
}

export type postMetric = {

        collection_count: number,
        comment_count: number,
        play_count: number,
        share_count: number,
        thumbs_up_count: number,
    // 打赏费用
        tip_count: number
}

export type UserCardInfo = {
    user: User,
    postMetric: postMetric,
    addNum: number,
}




export const users:UserCardInfo[] = [
    {
        user: {
            first_name: "Jamie",
            username: "Jamie Shon",
            id: "jamieshon",
            photo: "/mock/avatar.jpg",
            back_img: "/mock/usercard-background.jpg",
            about: "各位亲爱的粉丝：感谢有你们的陪伴，今日起订阅老用户一律5折，新用户8折",
            live_certification: true,
            blogger: true,
            status: 1,
            pt_user_id: 1,
            location: "中国",
        },
        postMetric: {
            collection_count: 11,
            comment_count: 22,
            play_count:33,
            share_count: 44,
            thumbs_up_count: 55,
            tip_count: 66
        },
        addNum: 99,
    },
    {
        user: {
            first_name: "多米洛",
            username: "多米洛",
            id: "duomiluogirl",
            photo: "/mock/avatar1.jpg",
            back_img: "/mock/header_image1.jpg",
            about: "各位亲爱的粉丝：感谢有你们的陪伴，今日起订阅老用户一律5折，新用户8折",
            live_certification: true,
            blogger: true,
            status: 1,
            pt_user_id: 1,
            location: "中国",
        },
        postMetric: {
            collection_count: 11,
            comment_count: 22,
            play_count:33,
            share_count: 44,
            thumbs_up_count: 55,
            tip_count: 66
        },
        addNum: 109,
    },
    {
        user: {
            first_name: "Lin",
            username: "Lin Lin",
            id: "linlin",
            photo: "/mock/avatar2.jpg",
            back_img: "/mock/header_image2.jpg",
            about: "各位亲爱的粉丝：感谢有你们的陪伴，今日起订阅老用户一律5折，新用户8折",
            live_certification: true,
            blogger: true,
            status: 1,
            pt_user_id: 1,
            location: "中国",
        },
        postMetric: {
            collection_count: 11,
            comment_count: 22,
            play_count:33,
            share_count: 44,
            thumbs_up_count: 55,
            tip_count: 66
        },
        addNum: 99,
    },
    {
        user: {
            first_name: "吐司",
            username: "吐司女孩",
            id: "tusibaby",
            photo: "/mock/avatar3.jpg",
            back_img: "/mock/header_image3.jpg",
            about: "各位亲爱的粉丝：感谢有你们的陪伴，今日起订阅老用户一律5折，新用户8折",
            live_certification: true,
            blogger: true,
            status: 1,
            pt_user_id: 1,
            location: "中国",
        },
        postMetric: {
            collection_count: 11,
            comment_count: 22,
            play_count:33,
            share_count: 44,
            thumbs_up_count: 55,
            tip_count: 66
        },
        addNum: 99,
    }
]

export type UserSubscribePayment = {
    id: string,
    time: string,
    amount: number,
    price: number,
    discount: number,
}

export const subscribePayments:UserSubscribePayment[] = [
    {
        id: "1",
        time: "1个月",
        amount: 9.99,
        price: 9.99,
        discount: 0.0,
    },
    {
        id: "2",
        time: "3个月",
        amount: 29.37,
        price: 29.97,
        discount: 0.98,
    },
    {
        id: "3",
        time: "99个月",
        amount: 882.09,
        price: 980.1,
        discount: 0.9,
    },
]