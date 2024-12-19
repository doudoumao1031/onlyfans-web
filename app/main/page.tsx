import UserCard from "@/components/user/card";
import {users} from "@/mock/user";

export default function Main() {
    return (
        <div>
            {/** 已订阅 */}
            <div className="w-full flex flex-col px-4">
                {users.map((user) => (
                    <div key={user.id} className="w-full mt-[10px]">
                        <UserCard user={user} subscribe={false}/>
                    </div>
                ))}
            </div>
            {/** 推荐博主 */}
            <div className="w-full flex flex-col px-4">
                {users.map((user) => (
                    <div key={user.id} className="w-full mt-[10px]">
                        <UserCard user={user} subscribe={true}/>
                    </div>
                ))}
            </div>
        </div>
    );
}