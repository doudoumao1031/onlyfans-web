import Image from "next/image"
import IconWithImage from "@/components/profile/icon"

const IMAGE_PREFIX = `${process.env.NEXT_PUBLIC_API_URL}/media/img/`
export default function Avatar({ showEdit, showLive,fileId }: { showEdit?: boolean, showLive?: boolean ,fileId:string}) {
  return (
    <div className="absolute rounded-full p-0.5 bg-white w-[90px] h-[90px] top-[-47px] left-[50%] ml-[-45px] ">
      <section className="w-full h-full relative rounded-full">
        <Image src={`${IMAGE_PREFIX}${fileId}`} alt="" className="rounded-full w-full h-full" width={90} height={90}/>
        {
          showLive && (
            <div className="absolute right-0 bottom-2 rounded-full p-1.5 bg-white">
              <Image className="rounded-full" src="/icons/profile/icon-game-live.png" width={20} height={20}
                alt="live"
              />
            </div>
          )
        }
        {
          showEdit && (
            <button type={"button"} className="absolute rounded-bl-full rounded-br-full left-0 bottom-0 h-[40px] w-full bg-[rgba(0,0,0,0.5)] text-white flex items-center justify-center">
              <IconWithImage
                url="/icons/profile/icon_camera@3x.png"
                width={24}
                height={24}
              />
            </button>
          )
        }
      </section>
    </div>
  )
}