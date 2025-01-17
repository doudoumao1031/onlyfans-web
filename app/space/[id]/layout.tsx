import TabLink from "@/components/space/tab-link"
import UserInfo from "@/components/space/userInfo"
import { userProfile } from "@/lib/actions/profile";
export default async function Layout(
    props: {
        children: React.ReactNode;
        modal: React.ReactNode;
        params: Promise<{ id: string }>
    }
) {
    const { id } = await props.params
    const response = await userProfile()
    const data = response?.data
    if (!data) {
        throw new Error()
    }
    return (
        <>
            {props.modal}
            <div className="flex flex-col w-full justify-start items-center" >
                <UserInfo data={data} />
                <TabLink id={id} data={data} />
                <div className="grow px-4 py-3 w-full h-3/4">{props.children}</div>

            </div>
            <div id="modal-root" />
        </>
    )
}
