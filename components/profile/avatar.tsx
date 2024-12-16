

export default function Avatar(){
    return <div className="absolute rounded-full p-0.5 bg-white w-[90px] h-[90px] top-[-47px] left-[50%] ml-[-45px]">
        <img src="/demo/user_bg.png" alt="" className="rounded-full w-full h-full"/>
        <div className="absolute right-0 bottom-2 rounded-full p-1.5 bg-white">
            <img className="rounded-full" src="/icons/profile/icon-game-live.png" width={20} height={20} alt="live" />
        </div>
    </div>
}