"use client";

import {SlideUpModal} from "@/components/common/slide-up-modal";
import TabTitle, {iTabTitleOption} from "@/components/profile/tab-title";
import {useState} from "react";

export default function Page() {
    const [active, setActive] = useState<string>("post")
    const tabOptions: iTabTitleOption[] = [
        {label: "帖子", name: "post"},
        {label: "媒体", name: "media"},
    ]
    const control = () => {
        return <button className="text-main-pink text-base">草稿</button>
    }
    return (
        <SlideUpModal title="稿件管理" portalId="modal-root" full headerRightControl={control} showPageHeader>
                <TabTitle tabOptions={tabOptions} active={active} activeChange={setActive}/>
        </SlideUpModal>
    );
}