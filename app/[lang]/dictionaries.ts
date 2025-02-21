import "server-only"

const dictionaries = {
  en: () => import("./dictionaries/en.json").then((module) => module.default),
  zh: () => import("./dictionaries/zh.json").then((module) => module.default)
}

export type Locale = keyof typeof dictionaries

export const getDictionary = async (locale: Locale) => {
  console.log("Requested locale:", locale)
  console.log("Available dictionaries:", Object.keys(dictionaries))
  return dictionaries[locale]()
}
