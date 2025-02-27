"use client"
import Modal from "@/components/space/modal"
import RechargeDrawer from "@/components/profile/recharge-drawer"
import { useTranslations } from "next-intl"

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
            className={"rounded-full border border-white text-center px-[20px] p-[6px] text-white"}
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
