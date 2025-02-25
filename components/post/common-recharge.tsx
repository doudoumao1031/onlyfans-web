"use client"
import Modal from "@/components/space/modal"
import RechargeDrawer from "@/components/profile/recharge-drawer"

interface CommonRechargeProps {
  visible: boolean
  setVisible: (visible: boolean) => void
  recharge: boolean
  setRecharge: (recharge: boolean) => void
}

export default function CommonRecharge(props: CommonRechargeProps) {
  const { visible, setVisible, recharge, setRecharge } = props
  return (
    <>
      <Modal
        visible={visible}
        cancel={() => {
          setVisible(false)
        }}
        type={"modal"}
        content={<div className="p-4 pb-6">余额不足</div>}
        okText="充值"
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
            充值
          </div>
        </RechargeDrawer>
      )}
    </>
  )
}