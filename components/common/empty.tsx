import Image from "next/image";
export default function Empty({ width = 200, height = 150, text }: { width?: number, height?: number, text?: string }) {
    return <div className="flex justify-center items-center flex-col mt-40">
        <Image
            src="/icons/profile/icon_detail_null.png"
            alt=""
            width={width}
            height={height}
        />
        <span className="text-[#777] mt-6">{text || '什么都没有'}</span>
    </div>
}