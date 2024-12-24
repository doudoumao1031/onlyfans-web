import Image from "next/image";

export default function Avatar({src, width = "w-16"}: { src: string, width?: string }) {
    return (
        <Image
            src={src}
            alt=""
            className={`rounded-full border-2 border-white ${width}`}
            width={50}
            height={50}
        />
    );
}