"use client"
import Header from "@/components/profile/header"
import Avatar from "@/components/profile/avatar"
import InputWithLabel from "@/components/profile/input-with-label"
import IconWithImage from "@/components/profile/icon"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { useEffect, useState } from "react"
import { updateUserBaseInfo, userProfile, UserProfile } from "@/lib/actions/profile"
import { useRouter } from "next/navigation"
import useCommonMessage from "@/components/common/common-message"

type EditUserProfile = Pick<
  UserProfile,
  "about" | "username" | "location" | "back_img" | "top_info" | "photo"
>

export default function Page() {
  const router = useRouter()
  const { renderNode, showMessage } = useCommonMessage()
  const { handleSubmit, control, setValue, watch } = useForm<EditUserProfile>({
    mode: "all",
    resolver: zodResolver(
      z.object({
        username: z.string({ message: "请输入昵称" }),
        about: z.string().optional(),
        location: z.string().optional(),
        photo: z.string().optional(),
        top_info: z.string().optional()
      })
    ),
    defaultValues: {}
  })
  const [userOrigin, setUserOrigin] = useState<UserProfile | undefined>(undefined)
  useEffect(() => {
    userProfile().then((response) => {
      const data = response?.data
      if (data) {
        setUserOrigin(data)
        const arr: Array<keyof EditUserProfile> = [
          "username",
          "about",
          "photo",
          "location",
          "back_img",
          "top_info"
        ]
        arr.forEach((item) => {
          setValue(item, data[item])
        })
      }
    })
  }, [setValue])

  const formValues = watch()

  return (
    <>
      {renderNode}
      <form
        onSubmit={handleSubmit((data) => {
          updateUserBaseInfo({
            ...data,
            flags: 31
          }).then((data) => {
            if (data?.code === 0) {
              router.back()
            } else {
              showMessage(data?.message)
            }
          })
        })}
      >
        <div className="profile-content bg-[url('/demo/user_bg.png')]">
          <Header right={<button type={"submit"}>保存</button>} title="编辑个人信息" />
        </div>
        <section className="mt-[-47px] rounded-t-3xl bg-white relative pt-12 text-black pb-8">
          <section className="pl-4 pr-4 pb-3 ">
            <Avatar
              showEdit
              fileId={formValues.photo}
              onAvatarChange={(fileId) => {
                setValue("photo", fileId)
              }}
            />
          </section>
          <section className="mt-5">
            <section className="pl-4 pr-4 flex flex-col gap-5 ">
              <section>
                <InputWithLabel
                  label={"昵称"}
                  value={`${userOrigin?.first_name ?? ""} ${userOrigin?.last_name ?? ""}`}
                  disabled
                />
              </section>
              <section>
                <Controller
                  control={control}
                  render={({ field }) => (
                    <InputWithLabel
                      onInputChange={field.onChange}
                      label={"用户名"}
                      value={field.value}
                      description={`https://secretfans.com/${field.value ?? ""}`}
                    />
                  )}
                  name={"username"}
                />
              </section>
              <section>
                <Controller
                  control={control}
                  render={({ field }) => (
                    <InputWithLabel
                      onInputChange={field.onChange}
                      value={field.value}
                      label={"介绍"}
                    />
                  )}
                  name={"about"}
                />
              </section>
              <section>
                <Controller
                  control={control}
                  render={({ field }) => (
                    <InputWithLabel
                      onInputChange={field.onChange}
                      value={field.value}
                      label={"顶部信息"}
                    />
                  )}
                  name={"top_info"}
                />
              </section>
              <section>
                <Controller
                  control={control}
                  render={({ field }) => (
                    <InputWithLabel
                      onInputChange={field.onChange}
                      value={field.value}
                      label={"地理位置"}
                    />
                  )}
                  name={"location"}
                />
              </section>
            </section>
            <section className="border-t border-gray-100 mt-5 pl-4 pr-4">
              <section>
                <button
                  type="button"
                  className="pt-4 pb-4 text-base w-full border-b border-gray-100 flex justify-between items-center"
                >
                  <span>直播认证</span>
                  <IconWithImage
                    url={"/icons/profile/icon-more.png"}
                    height={16}
                    width={16}
                    color={"#c0c0c0"}
                  />
                </button>
              </section>
              <section>
                <button
                  type="button"
                  className="pt-4 pb-4 text-base w-full border-b border-gray-100 flex justify-between items-center"
                >
                  <span>直播展示</span>
                  <span>Switch</span>
                </button>
              </section>
            </section>
          </section>
        </section>
      </form>
    </>
  )
}
