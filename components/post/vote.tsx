import { useState } from "react"
import Image from "next/image"
import { Vote as VoteData } from "./types"

export default function Vote({ data }: { data: VoteData }) {
  const { title, items, stop_time } = data
  const secondsToExpire = Math.floor((stop_time * 1000 - Date.now()) / 1000)
  const [showOptions, setShowOptions] = useState(false)
  const [showOptionAmount, setShowOptionAmount] = useState(3)
  const [selectedVoteIndex, setSelectedVoteIndex] = useState(-1)
  const totalVotes = items.reduce((t, o) => t + o.vote_count, 0)

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-2 items-end" onClick={() => setShowOptions((pre) => !pre)}>
        <Image src="/icons/vote.png" alt="" width={20} height={20} />
        <div className="text-red-500 text-sm">{title}</div>
        {showOptions ? (
          <Image src="/icons/arrow_up.png" alt="" width={20} height={20} />
        ) : (
          <Image src="/icons/arrow_down.png" alt="" width={20} height={20} />
        )}
      </div>
      {showOptions && (
        <div className="flex flex-col gap-1">
          {items.slice(0, showOptionAmount).map(({ content, vote_count }, i) =>
            secondsToExpire < 0 ? (
              <div
                key={i}
                className="w-full h-11 border rounded-md px-2 flex justify-between items-center bg-no-repeat"
                style={{
                  backgroundImage: `${
                    selectedVoteIndex === i ? "url(/icons/pink.png)" : "url(/icons/silver.png)"
                  }`,
                  backgroundSize: `${(vote_count / totalVotes) * 100}% 100%`,
                  borderColor: `${selectedVoteIndex === i ? "#FF8492" : "#DDDDDD"}`
                }}
                onClick={() => setSelectedVoteIndex(i)}
              >
                <div className="flex gap-1 h-full items-center">
                  {selectedVoteIndex === i && (
                    <Image src="/icons/select.png" alt="" width={20} height={20} />
                  )}
                  <div>{content}</div>
                </div>
                <div className="pr-3">{vote_count}票</div>
              </div>
            ) : (
              <div
                key={i}
                className="w-full h-11 border border-[#DDDDDD] rounded-md flex justify-center items-center"
              >
                <div>{content}</div>
              </div>
            )
          )}
          {showOptionAmount < items.length && (
            <div
              className="w-full h-11 border border-[#DDDDDD] rounded-md flex justify-center items-center"
              onClick={() => setShowOptionAmount(items.length)}
            >
              <div>查看全部选项</div>
            </div>
          )}
          <div className="text-[#999999]">
            {totalVotes}人参与 还有{(secondsToExpire / 3600).toFixed(2)}小时结束
          </div>
        </div>
      )}
    </div>
  )
}
