"use client";
// import SubScribeConfirm from '@/components/space/subscribe-confirm'
import { UserProfile } from '@/lib/actions/profile'
import SubscribedDrawer from '../explore/subscribed-drawer'


export default function Page({ data }: { data: UserProfile | undefined }) {
    if (!data) return null
    const triggerFn = (envent: () => void) => {
        return <div onClick={() => { envent() }} className="w-full h-12 bg-[#ff8492] rounded-lg  pl-4 mt-2 flex flex-col justify-center text-white bg-[url('/icons/space/bg_space_subscription.png')] bg-cover">
            <div>订阅</div>
            <div className="text-xs">免费</div>
        </div>
    }
    // return <SubScribeConfirm data={data}  >
    //     <div className="w-full h-12 bg-[#ff8492] rounded-lg  pl-4 mt-2 flex flex-col justify-center text-white bg-[url('/icons/space/bg_space_subscription.png')] bg-cover">
    //         <div>订阅</div>
    //         <div className="text-xs">免费</div>
    //     </div>
    // </SubScribeConfirm>

    return <SubscribedDrawer name={data.first_name} userId={Number(data.id)} trigger={triggerFn} />

}
