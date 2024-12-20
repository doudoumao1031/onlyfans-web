import {users} from "@/mock/user";
import Card from "@/components/user/user-card";

export default function Page() {
    return (
        /** 推荐博主 */
        <>
            {users.map((user) => (
                <div key={user.id} className="w-full mb-[10px]">
                    <Card user={user} subscribe={true}/>
                </div>
            ))}
        </>
    );
}