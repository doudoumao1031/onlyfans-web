// 稿件
import Image from "next/image";
import IconWithImage from "@/components/profile/icon";

const ShowNumberWithIcon = ({icon, number}: { icon: string, number: number }) => {
    return <section className="flex justify-center flex-col items-center flex-1">
        <IconWithImage url={icon} height={12} width={12} color={"#bbb"}/>
        <div className="text-[#777]">{number}</div>
    </section>
}

const ManuscriptActions = ()=>{
    return <section className="flex">
        <button className="flex-1 flex gap-2 pt-2.5 pb-2.5">
            <IconWithImage url={"/icons/profile/icon_fans_share@3x.png"} width={20} height={20} color={"#777"} />
            <span>分享</span>
        </button>
        <button className="flex-1 flex gap-2 pt-2.5 pb-2.5">
            <IconWithImage url={"/icons/profile/icon_fans_stick@3x.png"} width={20} height={20} color={"#777"} />
            <span>置顶</span>
        </button>
        <button className="flex-1 flex gap-2 pt-2.5 pb-2.5">
            <IconWithImage url={"/icons/profile/icon_fans_data@3x.png"} width={20} height={20} color={"#777"} />
            <span>数据</span>
        </button>
        <button className="flex-1 flex gap-2 pt-2.5 pb-2.5 text-main-pink">
            <IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20} color={"#FF8492"} />
            <span>编辑</span>
        </button>
    </section>
}

export default function ManuscriptItem() {
    return <section className="border-b border-gray-100">
        <button className={"flex gap-2.5 text-left h-[100px]"}>
            <Image src={"/demo/user_bg.png"} alt={""} width={100} height={100}
                   className={"shrink-0 w-[100px] h-full rounded"}/>
            <section className={"flex-1 h-full flex flex-col justify-between "}>
                <h3 className="line-clamp-[2]">amie Shon 的韩国文化 | Foxy Spots 与 Jamie Shon@luvjamxoxo
                    luvjamxoxoluvjamxoxoluvjamxoxo</h3>
                <section className={"flex-1 flex items-center text-[#bbb]"}>2022-02-02 12:12:12</section>
                <section className="flex gap-4 text-xs">
                    <ShowNumberWithIcon number={999} icon={"/icons/profile/icon_fans_like@3x.png"} />
                    <ShowNumberWithIcon number={999} icon={"/icons/profile/icon_fans_comment@3x.png"} />
                    <ShowNumberWithIcon number={999} icon={"/icons/profile/icon_fans_reward@3x.png"} />
                    <ShowNumberWithIcon number={999} icon={"/icons/profile/icon_fans_share@3x.png"} />
                    <ShowNumberWithIcon number={999} icon={"/icons/profile/icon_fans_collect@3x.png"} />
                    <ShowNumberWithIcon number={999} icon={"/icons/profile/icon_fans_money_s@3x.png"} />
                </section>
            </section>
        </button>
        <ManuscriptActions />
    </section>
}