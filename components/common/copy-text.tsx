import { useState } from "react";
import IconWithImage from "../profile/icon";

export default function Page({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // 2 秒后恢复
    } catch (err) {
      console.error("复制失败:", err);
    }
  };
  return (
    <span className="ml-2 h-[20px]">
      {copied ? "✅ 已复制!" : <span onClick={copyToClipboard}>
        <IconWithImage url={"/icons/icon_info_copy_gray@3x.png"} width={20}
          height={20} color={"#bbb"}
        />
      </span>}
    </span>
  )
}