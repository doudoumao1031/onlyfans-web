import Header from "@/components/common/header";
import Image from "next/image";
import Avatar from "@/components/profile/avatar";
import PostsCard from "@/components/profile/posts-card";
import IconWithImage from "@/components/profile/icon";
import Link from "next/link";

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return (
    <div>
      <div className="profile-content bg-[url('/demo/user_bg.png')]">
        <Header right={<>
          <IconWithImage
              url="/icons/profile/icon_nav_code@3x.png"
              width={22}
              height={22}
          />
          <IconWithImage
              url="/icons/profile/icon_fans_share@3x.png"
              width={22}
              height={22}
          />
        </>} title="My" backIconColor={'#fff'}/>
        <div className="text-xs pl-6 pr-6 text-white">
          各位亲爱的粉丝：感谢有你们的陪伴，今日起订阅老用户一律5折，新用户8折
        </div>
      </div>
      <section className="mt-[-47px] rounded-t-3xl bg-white relative  pt-12 text-black pb-8">
        <section className="pl-4 pr-4 pb-3 border-b border-b-gray-100">
          <Avatar showLive/>
          <h1 className="text-[18px] font-bold text-center justify-center items-center flex">
            <span>多米洛</span>
            <Link href={`/profile/${id}/edit`}>
              <button>
                <IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20} color={'#ddd'}/>
              </button>
            </Link>
          </h1>
          <div className="text-center text-gray-400 text-xs">@duomilougirl</div>
          <div className="flex justify-center mt-2">
            <button className="pt-0.5 pb-0.5 rounded-2xl pl-8 pr-8 border border-main-pink text-main-pink">
              进入空间
            </button>
          </div>
          <div className="text-xs mt-2.5">
            <section>Content Creator, Published Cover model, Biochem</section>
            <button className="text-main-pink mt-1">更多信息</button>
          </div>
        </section>
        <div className="p-5 border-b border-b-gray-100">
          <div className="grid-cols-4 grid text-center">
            <div className="border-r border-gray-100">
              <div className="text-2xl">9999</div>
              <div className="text-xs text-gray-400">帖子</div>
            </div>
            <div className="border-r border-gray-100">
              <div className="text-2xl">9999</div>
              <div className="text-xs text-gray-400">媒体</div>
            </div>
            <div className="border-r border-gray-100">
              <div className="text-2xl">9999</div>
              <div className="text-xs text-gray-400">粉丝</div>
            </div>
            <div>
              <div className="text-2xl">9999</div>
              <div className="text-xs text-gray-400">订阅</div>
            </div>
          </div>
        </div>

        <div className="pl-4 pr-4">
          <div className="flex justify-between items-center pt-2.5 pb-2.5">
            <h3 className="text-[15px] font-bold">收藏夹</h3>
            <Link href={`/profile/${id}/collect?type=blog`} className="text-gray-300">
              <IconWithImage url={"/icons/profile/icon_arrow_right@3x.png"} width={16} height={16} color={'#ddd'} />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Link href={`/profile/${id}/collect?type=blog`} className="rounded-xl pt-1.5 pl-4 bg-[url('/icons/profile/bg-collect-blogger.png')] bg-cover">
              <div className="text-xs text-gray-400">博主</div>
              <div className="font-medium text-[34px] ">9999</div>
            </Link>
            <Link href={`/profile/${id}/collect?type=post`} className="rounded-xl pt-1.5 pl-4 bg-[url('/icons/profile/bg-collect-posts.png')] bg-cover">
              <div className="text-xs text-gray-400">帖子</div>
              <div className="font-medium text-[34px] ">9999</div>
            </Link>
          </div>

          <PostsCard
            description={"成为唯粉博主，启航个人新旅途"}
            title={"开启的唯粉创作之路"}
            actionButton={"开启订阅"}
          />
          <PostsCard
            description={"分享你的帖子，赚取真金白银"}
            title={"发布你的第一个帖子"}
            actionButton={"立即参与"}
          />
          <PostsCard
            description={"通过订阅、打赏都可以赚取现金"}
            title={"发布你的帖子"}
            actionButton={"发布帖子"}
          />

          <div className="mt-5 ">
            <div className="grid grid-cols-3 gap-y-4">
              <Link href={`/profile/${id}/order`} className="flex justify-center flex-col items-center gap-2">
                <div>
                  <Image
                    src="/icons/profile/icon-subscription-management.png"
                    alt="subscription-management"
                    width={50}
                    height={50}
                  />
                </div>
                <div>订阅管理</div>
              </Link>
              <Link href={`/profile/${id}/manuscript`}  className="flex justify-center flex-col items-center gap-2">
                <div>
                  <Image
                    src="/icons/profile/icon-manuscript-management.png"
                    alt="icon-manuscript-management"
                    width={50}
                    height={50}
                  />
                </div>
                <div>稿件管理</div>
              </Link>
              <Link href={`/profile/${id}/fans/manage/subscribe`} className="flex justify-center flex-col items-center gap-2">
                <div>
                  <Image
                    src="/icons/profile/icon-fan-management.png"
                    alt="icon-fan-management"
                    width={50}
                    height={50}
                  />
                </div>
                <div>粉丝管理</div>
              </Link>
              <Link href={`/profile/${id}/income`} className="flex justify-center flex-col items-center gap-2">
                <div>
                  <Image
                    src="/icons/profile/icon-revenue-center.png"
                    alt="icon-revenue-center"
                    width={50}
                    height={50}
                  />
                </div>
                <div>收益中心</div>
              </Link>
              <Link href={`/profile/${id}/dataCenter`} className="flex justify-center flex-col items-center gap-2">
                <div>
                  <Image
                    src="/icons/profile/icon-data-analysis.png"
                    alt="icon-data-analysis"
                    width={50}
                    height={50}
                  />
                </div>
                <div>数据分析</div>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
