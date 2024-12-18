import Image from "next/image";
import IconWithImage from "@/components/profile/icon";


export default function Avatar({showEdit, showLive}: { showEdit?: boolean, showLive?: boolean }) {
    return <div className="absolute rounded-full p-0.5 bg-white w-[90px] h-[90px] top-[-47px] left-[50%] ml-[-45px] ">
        <section className="overflow-hidden w-full h-full relative rounded-full">
            <Image src="/demo/user_bg.png" alt="" className="rounded-full w-full h-full" width={90} height={90}/>
            {
                showLive && <div className="absolute right-0 bottom-2 rounded-full p-1.5 bg-white">
                    <Image className="rounded-full" src="/icons/profile/icon-game-live.png" width={20} height={20}
                           alt="live"/>
                </div>
            }
            {
                showEdit && <button className="absolute left-0 bottom-0 h-[40px] w-full bg-[rgba(0,0,0,0.5)] text-white flex items-center justify-center">
                    <IconWithImage
                        url="/icons/profile/icon-camera.png"
                        width={24}
                        height={24}
                    />
                </button>
            }
        </section>
    </div>
}