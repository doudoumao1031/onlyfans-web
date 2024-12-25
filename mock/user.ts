export type User = {
    name: string,
    id: string,
    avatar: string,
    backgroundImage: string,
    about?: string,
    addNum?:number,
    photo?:number,
    video?:number,
    vlog?:boolean,
}

export const users:User[] = [
    {
        name: "Jamie Shon",
        id: "jamieshon",
        avatar: "/mock/avatar.jpg",
        backgroundImage: "/mock/usercard-background.jpg",
        about: "各位亲爱的粉丝：感谢有你们的陪伴，今日起订阅老用户一律5折，新用户8折",
        addNum: 36,
        photo: 37,
        video: 38,
        vlog: true,
    },
    {
        name: "多米洛",
        id: "duomiluogirl",
        avatar: "/mock/avatar1.jpg",
        backgroundImage: "/mock/header_image1.jpg",
        about: "各位亲爱的粉丝：感谢有你们的陪伴，今日起订阅老用户一律5折，新用户8折",
        addNum: 46,
        photo: 47,
        video: 48,
    },
    {
        name: "Lin Lin",
        id: "linlin",
        avatar: "/mock/avatar2.jpg",
        backgroundImage: "/mock/header_image2.jpg",
        about: "各位亲爱的粉丝：感谢有你们的陪伴，今日起订阅老用户一律5折，新用户8折",
        addNum: 56,
        photo: 57,
        video: 58,
    },
    {
        name: "吐司女孩",
        id: "tusibaby",
        avatar: "/mock/avatar3.jpg",
        backgroundImage: "/mock/header_image3.jpg",
        addNum: 76,
        photo: 77,
        video: 78,
    },
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