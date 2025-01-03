import Card from "@/components/user/user-card";
import {userCollectionUsers} from "@/lib/data";

export default async function Page() {
    const bloggers = await userCollectionUsers({from_id: 1, page: 1, pageSize: 10});
    console.log("=====> bloggers", bloggers);
    return (
        /** 已订阅 */
        <>
            {bloggers && bloggers?.total > 0 && bloggers?.list.map((info) => (
                <div key={info.id} className="w-full mb-[10px]">
                    <Card user={info} subscribe={false}/>
                </div>
            ))}
        </>
    );
}