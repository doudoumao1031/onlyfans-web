import Image from "next/image";

export default function Avatar({src, vlog = false, width = "w-16"}: { src: string, vlog?: boolean, width?: string }) {
    return (
        <div className={`relative ${width}`}>
            <Image
                src={src ?? "/mock/avatar1.jpg"}
                alt=""
                className={`rounded-full border-2 border-white ${width}`}
                width={50}
                height={50}
            />
            {vlog && <div
                className="absolute rounded-full bottom-0 right-0 w-[24px] h-[24px] bg-white flex justify-center items-center">
                <Image src="/icons/explore/icon_sign_gamevlog@3x.png" alt="gamevlog"
                       width={16}
                       height={16}
                       className="rounded-full"
                />
            </div>}

        </div>
    );
}