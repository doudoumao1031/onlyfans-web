import EmojiPickerComp from "emoji-picker-react"
import { CategoryConfig } from "emoji-picker-react/dist/config/categoryConfig"
import { useTranslations } from "next-intl"

export default function EmojiPicker({ onClick }: { onClick: (emoji: string) => void }) {
  const t = useTranslations("Common")
  const categories = [
    // {
    //   category:"suggested",
    //   name: t("emoji.SUGGESTED")
    // },
    {
      category: "custom",
      name: t("emoji.CUSTOM")
    },
    {
      category: "smileys_people",
      name: t("emoji.SMILEYS_PEOPLE")
    },
    {
      category: "animals_nature",
      name: t("emoji.ANIMALS_NATURE")
    },
    {
      category: "food_drink",
      name: t("emoji.FOOD_DRINK")
    },
    {
      category: "travel_places",
      name: t("emoji.TRAVEL_PLACES")
    },
    {
      category: "activities",
      name: t("emoji.ACTIVITIES")
    },
    {
      category: "objects",
      name: t("emoji.OBJECTS")
    },
    {
      category: "symbols",
      name: t("emoji.SYMBOLS")
    },
    {
      category: "flags",
      name: t("emoji.FLAGS")
    }

  ] as CategoryConfig[]

  return (
    <div className="flex h-[350px] flex-wrap gap-2 overflow-y-auto p-2 shadow-md">
      <EmojiPickerComp
        onEmojiClick={(emoji) => onClick(emoji.emoji)}
        searchDisabled={true}
        categories={categories}
        skinTonesDisabled={true}
        width={"100%"}
        height={"100%"}
        previewConfig={{
          showPreview: false
        }}
      />
      {/* {emojis.map((emoji) => (
        <Emoji emoji={emoji} onClick={onClick} key={emoji} />
      ))} */}
    </div>
  )
}

// function Emoji({ emoji, onClick }: { emoji: string; onClick: (emoji: string) => void }) {
//   return (
//     <div onClick={() => onClick(emoji)} className="text-3xl">
//       {emoji}
//     </div>
//   )
// }

// const emojis = [
//   "😀",
//   "😃",
//   "😄",
//   "😁",
//   "😆",
//   "😅",
//   "😂",
//   "🤣",
//   "🥲",
//   "🥹",
//   "☺️",
//   "😊",
//   "😇",
//   "🙂",
//   "🙃",
//   "😉",
//   "😌",
//   "😍",
//   "🥰",
//   "😘",
//   "😗",
//   "😙",
//   "😚",
//   "😋",
//   "😛",
//   "😝",
//   "😜",
//   "🤪",
//   "🤨",
//   "🧐",
//   "🤓",
//   "😎",
//   "🥸",
//   "🤩",
//   "🥳",
//   "🙂‍↕️",
//   "😏",
//   "😒",
//   "🙂‍↔️",
//   "😞",
//   "😔",
//   "😟",
//   "😕",
//   "🙁",
//   "☹️",
//   "😣",
//   "😖",
//   "😫",
//   "😩",
//   "🥺",
//   "😢",
//   "😭",
//   "😮‍💨",
//   "😤",
//   "😠",
//   "😡",
//   "🤬",
//   "🤯",
//   "😳",
//   "🥵",
//   "🥶",
//   "😱",
//   "😨",
//   "😰",
//   "😥",
//   "😓",
//   "🫣",
//   "🤗",
//   "🫡",
//   "🤔",
//   "🫢",
//   "🤭",
//   "🤫",
//   "🤥",
//   "😶",
//   "😶‍🌫️",
//   "😐",
//   "😑",
//   "😬",
//   "🫨",
//   "🫠",
//   "🙄",
//   "😯",
//   "😦",
//   "😧",
//   "😮",
//   "😲",
//   "🥱",
//   "😴",
//   "🤤",
//   "😪",
//   "😵",
//   "😵‍💫",
//   "🫥",
//   "🤐",
//   "🥴",
//   "🤢",
//   "🤮",
//   "🤧",
//   "😷",
//   "🤒",
//   "🤕",
//   "🤑",
//   "🤠",
//   "😈",
//   "👿",
//   "👹",
//   "👺",
//   "🤡",
//   "💩",
//   "👻",
//   "💀",
//   "☠️",
//   "👽",
//   "👾",
//   "🤖",
//   "🎃",
//   "😺",
//   "😸",
//   "😹",
//   "😻",
//   "😼",
//   "😽",
//   "🙀",
//   "😿",
//   "😾"
// ]
