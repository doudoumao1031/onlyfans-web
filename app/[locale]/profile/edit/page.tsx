"use client"
import React, { useEffect, useMemo } from "react"


import { zodResolver } from "@hookform/resolvers/zod"
import { useTranslations } from "next-intl"
import { Controller, useForm } from "react-hook-form"
import { z } from "zod"

import { useRouter } from "next/navigation"

import { useCommonMessageContext } from "@/components/common/common-message"
import Avatar from "@/components/profile/avatar"
import Header from "@/components/profile/header"
import InputWithLabel from "@/components/profile/input-with-label"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import { updateUserBaseInfo, userProfile, UserProfile } from "@/lib/actions/profile"
import { buildImageUrl, commonUploadFile } from "@/lib/utils"


type EditUserProfile = Pick<
  UserProfile,
  "about" | "username" | "location" | "back_img" | "top_info" | "photo" | "first_name"
>

export default function Page() {
  const router = useRouter()
  const { showMessage } = useCommonMessageContext()
  const t = useTranslations("Profile.edit")
  const commonTrans = useTranslations("Common")
  const { handleSubmit, control, setValue, watch, reset } = useForm<EditUserProfile>({
    mode: "all",
    resolver: zodResolver(
      z.object({
        username: z.string({ message: "请输入昵称" }),
        about: z.string().max(999, "最多999字").optional(),
        location: z.string().max(30, "最多30个字").optional(),
        photo: z.string().optional(),
        top_info: z.string().max(30, "最多30个字").optional(),
        back_img: z.string().optional()
      })
    ),
    defaultValues: {}
  })
  useEffect(() => {
    userProfile().then((response) => {
      const data = response?.data
      if (data) {
        reset(data)
      }
    })
  }, [reset])

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
      showMessage(commonTrans("updateFail"))
    },
    onSuccess: () => {
      showMessage(commonTrans("updateSuccess"), "success", {
        // 跳转到个人主页(需要刷新页面)
        afterDuration: () => router.replace("/profile")
      })
    }
  })

  const backImageStyle = useMemo(() => {
    if (formValues.back_img) {
      return {
        backgroundImage: `url(${buildImageUrl(formValues.back_img)})`
      }
    }
    return {}
  }, [formValues.back_img])

  return (
    <>
      <form
        className={"relative"}
        onSubmit={handleSubmit(async (data) => {
          await withLoading(async () => {
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
        <div className={"absolute left-0 top-0 z-20 w-full bg-black/20 text-white"}>
          <Header right={<button type={"submit"}>{commonTrans("save")}</button>} title={t("title")} backColor={"#fff"} />
        </div>
        <div className="profile-content relative bg-[url('/icons/image_fans_normal_05.png')] bg-cover"
          style={backImageStyle}
        >
          <input
            type="file"
            accept="image/*"
            multiple={false}
            className="absolute z-10 size-full opacity-0"
            onChange={(event) => {
              if (event.target.files?.length) {
                handleUploadFile(event.target.files[0])
                event.target.value = ""
              }
            }}
          />
          <div className={"absolute bottom-0 right-4 text-xs text-white"}>{t("changeBackgroundImage")}</div>
          <div className="absolute left-0 top-0 size-full bg-black/20"></div>
        </div>
        <section className="relative bg-white pb-8">
          <section className="px-4 pb-3 ">
            <div className={"relative top-[-24px] inline-block"}>
              <Avatar
                showEdit
                fileId={formValues.photo}
                onAvatarChange={(fileId) => {
                  setValue("photo", fileId)
                }}
              />
            </div>
          </section>
          <section className="mt-[-12px]">
            <section className="flex flex-col gap-5 px-4 ">
              <section>
                <Controller control={control} render={({ field }) => {
                  return (
                    <InputWithLabel
                      label={t("form.nickname")}
                      value={field.value}
                      disabled
                    />
                  )
                }} name={"first_name"}
                />
              </section>
              <section>
                <Controller
                  control={control}
                  render={({ field }) => (
                    <InputWithLabel
                      onInputChange={field.onChange}
                      label={t("form.username")}
                      value={field.value}
                      disabled
                      copy={true}
                      description={`https://secretfans.com/${field.value ?? ""}`}
                    />
                  )}
                  name={"username"}
                />

              </section>
              <section>
                <Controller
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputWithLabel
                      errorMessage={fieldState.error?.message}
                      onInputChange={field.onChange}
                      value={field.value}
                      label={t("form.introduction")}
                      type={"textarea"}
                      rows={5}
                      maxLength={999}
                    />
                  )}
                  name={"about"}
                />
              </section>
              <section>
                <Controller
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputWithLabel
                      onInputChange={field.onChange}
                      maxLength={30}
                      value={field.value}
                      label={t("form.topInfo")}
                      type={"textarea"}
                      rows={5}
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                  name={"top_info"}
                />
              </section>
              <section>
                <Controller
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputWithLabel
                      onInputChange={field.onChange}
                      value={field.value}
                      type={"textarea"}
                      rows={5}
                      maxLength={30}
                      label={t("form.location")}
                      errorMessage={fieldState.error?.message}
                    />
                  )}
                  name={"location"}
                />
              </section>
            </section>
            {/*<section className="border-t border-gray-100 mt-5 pl-4 pr-4">*/}
            {/*  <section>*/}
            {/*    <button*/}
            {/*      type="button"*/}
            {/*      className="pt-4 pb-4 text-base w-full border-b border-gray-100 flex justify-between items-center"*/}
            {/*    >*/}
            {/*      <span>{t("form.liveAuth")}</span>*/}
            {/*      <IconWithImage*/}
            {/*        url={"/icons/profile/icon-more.png"}*/}
            {/*        height={16}*/}
            {/*        width={16}*/}
            {/*        color={"#c0c0c0"}*/}
            {/*      />*/}
            {/*    </button>*/}
            {/*  </section>*/}
            {/*  <section>*/}
            {/*    <div*/}
            {/*      className="pt-4 pb-4 text-base w-full border-b border-gray-100 flex justify-between items-center"*/}
            {/*    >*/}
            {/*      <span>{t("form.liveShow")}</span>*/}
            {/*      <span>*/}
            {/*        <Switch className={"custom-switch"}/>*/}
            {/*      </span>*/}
            {/*    </div>*/}
            {/*  </section>*/}
            {/*</section>*/}
          </section>
        </section>
      </form>
    </>
  )
}
