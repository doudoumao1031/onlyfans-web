import {users} from "@/mock/user";
import Card from "@/components/user/user-card";

export default function Page() {
    return (
        /** 已订阅 */
        <>
            {users.map((user) => (
                <div key={user.user.id} className="w-full mb-[10px]">
                    <Card card={user} subscribe={false}/>
                </div>
            ))}
        </>
    );
}