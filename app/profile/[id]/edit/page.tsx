import Header from "@/components/profile/header";
import Avatar from "@/components/profile/avatar";
import InputWithLabel from "@/components/profile/input-with-label";
import IconWithImage from "@/components/profile/icon";

export default function Page (){

    return <>
    <div className="profile-content bg-[url('/demo/user_bg.png')]">
        <Header right={<button>保存</button>} title="编辑个人信息" />
        {/* <div className="text-xs pl-6 pr-6">
          各位亲爱的粉丝：感谢有你们的陪伴，今日起订阅老用户一律5折，新用户8折
        </div> */}
      </div>
        <section className="mt-[-47px] rounded-t-3xl bg-white relative pt-12 text-black pb-8">
            <section className="pl-4 pr-4 pb-3 ">
                <Avatar showEdit/>
            </section>
            <form className="mt-5">
                <section className="pl-4 pr-4 flex flex-col gap-5 ">
                    <section>
                        <InputWithLabel name={"nickname"} label={"昵称"} value={"123123"} disabled/>
                    </section>
                    <section>
                        <InputWithLabel name={"username"} label={"用户名"} value={"123123"}
                                        description={"https://secretfans.com/duomilougirl"}/>
                    </section>
                    <section>
                        <InputWithLabel name={"description"} value={""} placeholder={"介绍"}/>
                    </section>
                    <section>
                        <InputWithLabel name={"top_info"} value={""} placeholder={"顶部信息"}/>
                    </section>
                    <section>
                        <InputWithLabel name={"position"} value={""} placeholder={"地理位置"}/>
                    </section>
                </section>
                <section className="border-t border-gray-100 mt-5 pl-4 pr-4">
                    <section>
                        <button type="button"
                                className="pt-4 pb-4 text-base w-full border-b border-gray-100 flex justify-between items-center">
                            <span>直播认证</span>
                            <IconWithImage url={"/icons/profile/icon-more.png"} height={16} width={16}
                                           color={'#c0c0c0'}/>
                        </button>
                    </section>
                    <section>
                        <button type="button"
                                className="pt-4 pb-4 text-base w-full border-b border-gray-100 flex justify-between items-center">
                            <span>直播展示</span>
                            <span>Switch</span>
                        </button>
                    </section>
                </section>
            </form>
        </section>
    </>
}