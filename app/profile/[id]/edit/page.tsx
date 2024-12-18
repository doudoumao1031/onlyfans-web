import Header from "@/components/profile/header";

export default function Page (){
    return <>
    <div className="profile-content bg-[url('/demo/user_bg.png')]">
        <Header right={<button>保存</button>} title="编辑个人信息" />
        {/* <div className="text-xs pl-6 pr-6">
          各位亲爱的粉丝：感谢有你们的陪伴，今日起订阅老用户一律5折，新用户8折
        </div> */}
      </div>
    </>
}