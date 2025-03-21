"use client"
import { useTranslations } from "next-intl"

import RechargeDrawer from "@/components/profile/recharge-drawer"
import Modal from "@/components/space/modal"

interface CommonRechargeProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  recharge: boolean
  setRecharge: (recharge: boolean) => void
}

export default function CommonRecharge(props: CommonRechargeProps) {
  const { visible, setVisible, recharge, setRecharge } = props
  const t = useTranslations("Common.post")
  return (
    <>
      <Modal
        visible={visible}
        cancel={() => {
          setVisible(false)
        }}
        type={"modal"}
        content={<div className="p-4 pb-6">{t("insufficientBalance")}</div>}
        okText={t("recharge")}
        confirm={() => {
          setVisible(false)
          setRecharge(true)
        }}
      />
      {recharge && (
        <RechargeDrawer isOpen={recharge} setIsOpen={setRecharge} setWfAmount={() => {}}>
          <div
            className={"rounded-full border border-white p-[6px] px-[20px] text-center text-white"}
            onTouchEnd={() => {
              setRecharge(true)
            }}
          >
            {t("recharge")}
          </div>
        </RechargeDrawer>
      )}
    </>
  )
}
