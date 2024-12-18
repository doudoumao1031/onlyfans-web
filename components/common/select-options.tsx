"use client";
import { SlideUpModal } from "@/components/common/slide-up-modal";
import clsx from "clsx";

export interface ModalOption {
  label: "";
  value: undefined;
  description?: string;
}

export default function SelectOptions({
  value,
  options,
  onChange,
}: {
  options: ModalOption[];
  value: unknown;
  onChange: (value: unknown) => void;
}) {
  return (
    <SlideUpModal portalId="modal-root">
      <div className="rounded-2xl">
        {options.map((item,index,arr) => {
          return (
            <div
              className={
                clsx(
                    "pl-8 pr-8 pt-4 pb-4 text-[19px] text-neutral-800",
                    index !== arr.length - 1 ? "border-b border-b-gray-100" :""
                )
              }
              key={item.value}
              onTouchEnd={() => {
                onChange(item.value);
              }}
            >
              {item.label}
              {item?.description && <span className="text-gray-300">{item?.description}</span>}
            </div>
          );
        })}
      </div>

      <div className="mt-2">
        <button className="block w-full text-center text-main-pink font-bold pt-3.5 pb-3.5">取消</button>
      </div>
    </SlideUpModal>
  );
}
