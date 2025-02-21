"use client"
import Header from "@/components/profile/header"
import Avatar from "@/components/profile/avatar"
import InputWithLabel from "@/components/profile/input-with-label"
import IconWithImage from "@/components/profile/icon"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import React, { useEffect, useState } from "react"
import { updateUserBaseInfo, userProfile, UserProfile } from "@/lib/actions/profile"
import { useRouter } from "next/navigation"
import { useCommonMessageContext } from "@/components/common/common-message"
import { commonUploadFile } from "@/lib/utils"
import { Switch } from "@/components/ui/switch"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"

type EditUserProfile = Pick<
  UserProfile,
  "about" | "username" | "location" | "back_img" | "top_info" | "photo"
>

const IMAGE_PREFIX = `${process.env.NEXT_PUBLIC_API_URL}/media/img/`

export default function Page() {
  const router = useRouter()
  const { showMessage } = useCommonMessageContext()
  const { handleSubmit, control, setValue, watch } = useForm<EditUserProfile>({
    mode: "all",
    resolver: zodResolver(
      z.object({
        username: z.string({ message: "请输入昵称" }),
        about: z.string().max(999,"最多999字").optional(),
        location: z.string().optional(),
        photo: z.string().optional(),
        top_info: z.string().optional(),
        back_img: z.string().optional()
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
  const handleUploadFile = (file: File) => {
    commonUploadFile(file).then((res) => {
      if (res?.file_id) {
        setValue("back_img", res.file_id)
      }
    })
  }

  const { withLoading } = useLoadingHandler({
    onError: () => {
      showMessage("更新失败")
    },
    onSuccess: () => {
      showMessage("更新成功", "success", {
        afterDuration: router.back
      })
    }
  })

  return (
    <>
      <form
        className={"relative"}
        onSubmit={handleSubmit(async(data) => {
          await withLoading(async() => {
            const response = await updateUserBaseInfo({
              ...data,
              flags: 31
            })
            if (response?.code === 0) {
              return Promise.resolve()
            } else {
              return Promise.reject(response?.message)
            }
          })
        })}
      >
        <div className={"w-full left-0 top-0 absolute z-20 text-white"}>
          <Header right={<button type={"submit"}>保存</button>} title="上传背景图" backColor={"#fff"}/>
        </div>
        <div className="profile-content bg-[url('/demo/user_bg.png')] relative bg-cover" style={{ backgroundImage: `url(${IMAGE_PREFIX}${formValues.back_img})` }}>
          <input
            type="file"
            accept="image/*"
            multiple={false}
            className="w-full h-full opacity-0 z-10 absolute"
            onChange={(event) => {
              if (event.target.files?.length) {
                handleUploadFile(event.target.files[0])
              }
            }}
          />
          <div className={"text-xs text-white absolute right-4 top-24"}>点击空白区域更换背景</div>
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
                      disabled
                      description={`https://secretfans.com/${field.value ?? ""}`}
                    />
                  )}
                  name={"username"}
                />
              </section>
              <section>
                <Controller
                  control={control}
                  render={({ field,fieldState }) => (
                    <InputWithLabel
                      errorMessage={fieldState.error?.message}
                      onInputChange={field.onChange}
                      value={field.value}
                      label={"介绍"}
                      type={"textarea"}
                      rows={5}
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
                <div
                  className="pt-4 pb-4 text-base w-full border-b border-gray-100 flex justify-between items-center"
                >
                  <span>直播展示</span>
                  <span>
                    <Switch className={"custom-switch"}/>
                  </span>
                </div>
              </section>
            </section>
          </section>
        </section>
      </form>
    </>
  )
}
