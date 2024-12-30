"use client"
import {UserCardInfo, users} from "@/mock/user";
import {useState} from "react";
import {ToggleGroupRecom, ToggleGroupRecomItem} from "@/components/ui/toggle-group-recommended";
import UserCard from "@/components/user/user-card";

export default function Page() {
    const [userList, setUserList] = useState<UserCardInfo[]>(users);
    return (
        /** 推荐博主 */
        <>
            <ToggleGroupRecom type="single" variant="default" defaultValue="1" id="select_type"
                              className="w-full flex justify-between mb-[10px]"
                              onValueChange={(val) => {
                                  if ("1" === val) {
                                      setUserList(users);
                                  } else if ("2" === val) {
                                      setUserList(users.slice(0, 2));
                                  } else if ("3" === val) {
                                      setUserList(users.slice(0, 3));
                                  }
                              }}>
                <ToggleGroupRecomItem value="1">
                    <span className="text-nowrap font-medium text-base">热门推荐</span>
                </ToggleGroupRecomItem>
                <ToggleGroupRecomItem value="2">
                    <span className="text-nowrap font-medium text-base">新人推荐</span>
                </ToggleGroupRecomItem>
                <ToggleGroupRecomItem value="3">
                    <span className="text-nowrap font-medium text-base">🔥人气博主</span>
                </ToggleGroupRecomItem>
            </ToggleGroupRecom>
            {userList.map((user) => (
                <div key={user.user.id} className="w-full mb-[10px]">
                    <UserCard card={user} subscribe={true}/>
                </div>
            ))}
        </>
    );
}