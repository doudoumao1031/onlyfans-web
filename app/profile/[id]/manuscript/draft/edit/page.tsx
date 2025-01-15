"use client"
import React, { HTMLAttributes, useEffect, useMemo, useRef, useState } from "react"
import clsx from "clsx"
import IconWithImage from "@/components/profile/icon"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"
import FormDrawer from "@/components/common/form-drawer"
import InputWithLabel from "@/components/profile/input-with-label"
import SheetSelect, { ISelectOption } from "@/components/common/sheet-select"
import ConfirmModal from "@/components/common/confirm-modal"
import { Controller, FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import DatePickerModal from "@/components/common/date-picker-modal"
import dayjs from "dayjs"
import { z } from "zod"
import Image from "next/image"
import * as process from "process"
import {
  postVoteSchema,
  iPostVote,
  iPostPrice,
  postPriceSchema,
  iPost,
  postSchema,
  addPost
} from "@/lib/actions/profile"
import { uploadMediaFile } from "@/lib"
import { getUploadMediaFileType, uploadFile } from "@/lib/utils"

const ItemEditTitle = ({
  title,
  showIcon = true
}: {
  title: React.ReactNode
  showIcon?: boolean
}) => {
  return (
    <div className="flex gap-2.5 items-center">
      <div className="font-bold text-base">{title}</div>
      {showIcon && (
        <IconWithImage
          url={"/icons/profile/icon_edit@3x.png"}
          width={20}
          height={20}
          color={"#bbb"}
        />
      )}
    </div>
  )
}

const FormItemWithSelect = ({
  label,
  value,
  options,
  onValueChange
}: {
  label: React.ReactNode
  options: ISelectOption[]
  value: unknown
  className?: Pick<HTMLAttributes<HTMLElement>, "className">
  onValueChange?: (value: unknown) => void
}) => {
  const showLabel = options.find((item) => item.value === value)?.label
  return (
    <section className="flex justify-between items-center border-b border-[#ddd] py-4">
      <div>{label}</div>
      <SheetSelect outerControl={false} options={options} onInputChange={onValueChange}>
        <div className={"flex items-center justify-center gap-1.5 text-[#777]"}>
          <span>{showLabel}</span>
          <IconWithImage
            url={"/icons/profile/icon_arrow_right@3x.png"}
            width={16}
            height={16}
            color={"#ddd"}
          />
        </div>
      </SheetSelect>
    </section>
  )
}

const AddVoteModal = ({
  children,
  initFormData,
  updateVoteData
}: {
  children: React.ReactNode
  initFormData?: iPostVote
  updateVoteData: (data: iPostVote) => void
}) => {
  const [open, setIsOpen] = useState<boolean>(false)
  const voteForm = useForm<iPostVote>({
    mode: "all",
    resolver: zodResolver(postVoteSchema),
    defaultValues: initFormData ?? {
      items: [],
      title: "",
      stop_time: Date.now(),
      mu_select: false
    }
  })
  const { formState, watch, reset, trigger, getValues, control } = voteForm
  const { fields: itemsList, append } = useFieldArray({
    control,
    name: "items"
  })
  const saveVote = (data: iPostVote) => {
    updateVoteData(data)
    setIsOpen(false)
  }
  useEffect(() => {
    if (open) reset()
  }, [open, reset])

  useEffect(() => {
    if (voteForm.getValues().items.length === 0) {
      append({ content: "" })
      append({ content: "" })
    }
  }, [])

  return (
    <>
      <button
        onTouchEnd={() => {
          setIsOpen(true)
        }}
      >
        {children}
      </button>
      <FormDrawer
        title={"发起投票"}
        isOpen={open}
        setIsOpen={setIsOpen}
        outerControl
        headerLeft={(close) => {
          return (
            <button onTouchEnd={close} className={"text-base text-[#777]"}>
              <IconWithImage
                url={"/icons/profile/icon_close@3x.png"}
                width={24}
                height={24}
                color={"#000"}
              />
            </button>
          )
        }}
        headerRight={() => {
          return (
            <button
              type={"button"}
              onTouchEnd={() => {
                trigger().then((valid) => {
                  if (valid) {
                    const values = getValues()
                    const optionCheck = values.items.filter((item) => !!item.content)
                    if (optionCheck.length < 2) {
                      alert("完善选项")
                      return
                    }
                    saveVote({
                      ...values,
                      items: optionCheck
                    })
                  }
                })
              }}
              className={"text-base text-main-pink"}
            >
              确定
            </button>
          )
        }}
        trigger={children}
      >
        <section className={"py-5 px-4 border-b border-[#ddd] relative"}>
          <Controller
            control={control}
            render={({ field }) => {
              return (
                <InputWithLabel
                  value={field.value}
                  onInputChange={field.onChange}
                  label={"投票标题"}
                />
              )
            }}
            name="title"
          />
          <div className=" absolute left-8 bottom-0 text-xs text-red-600">
            {formState.errors.title?.message}
          </div>
        </section>
        <section className={"py-5 px-4 border-b border-[#ddd]"}>
          <h3 className="font-medium text-base mb-2">
            投票内容
            {watch("items").length < 2 && (
              <span className="text-xs text-red-600 ml-2 font-normal">最少2个选项</span>
            )}
          </h3>
          <section className="flex flex-col gap-5 mt-2">
            {itemsList.map((field, index) => {
              return (
                <Controller
                  key={field.id}
                  name={`items.${index}.content`}
                  control={control}
                  render={({ field }) => {
                    return (
                      <InputWithLabel
                        value={field.value}
                        onInputChange={field.onChange}
                        label={"请输入投票内容"}
                      />
                    )
                  }}
                />
              )
            })}
            <button
              onTouchEnd={() => {
                append({ content: "" })
              }}
              className="flex gap-1.5 w-full rounded-xl border border-main-pink justify-center items-center py-2.5 text-main-pink"
            >
              <IconWithImage
                url={"/icons/profile/icon_add@3x.png"}
                color={"#FF8492"}
                width={20}
                height={20}
              />
              添加选项
            </button>
          </section>
        </section>
        <section className="px-4">
          <Controller
            control={control}
            render={({ field }) => {
              return (
                <FormItemWithSelect
                  onValueChange={field.onChange}
                  label={"单选/多选"}
                  value={field.value}
                  options={[
                    { label: "单选", value: false },
                    { label: "多选", value: true }
                  ]}
                />
              )
            }}
            name={"mu_select"}
          />
          <section className="flex justify-between items-center border-b border-[#ddd] py-4">
            <div>截止时间</div>
            <Controller
              control={control}
              render={({ field }) => {
                return (
                  <DatePickerModal
                    onValueChange={(value) => {
                      field.onChange(dayjs(value).endOf("date").valueOf())
                    }}
                    trigger={
                      <button className={"flex items-center justify-center gap-1.5 text-[#777]"}>
                        <span>
                          <input
                            className="text-right"
                            readOnly
                            value={dayjs(field.value).format("YYYY-MM-DD HH:mm")}
                          />
                        </span>
                        <IconWithImage
                          url={"/icons/profile/icon_arrow_right@3x.png"}
                          width={16}
                          height={16}
                          color={"#ddd"}
                        />
                      </button>
                    }
                  />
                )
              }}
              name={"stop_time"}
            />
          </section>
        </section>
      </FormDrawer>
    </>
  )
}

const transformPriceSettingOption = (value: number) => {
  if (value < 3) {
    return {
      user_type: value,
      visibility: true
    }
  }
  if (value === 3) {
    return {
      user_type: 2,
      visibility: false
    }
  }
}

const revertPriceSettingOption = (list: iPostPrice[]) => {
  return (
    list.map((item) => {
      if (item.user_type < 2) {
        return item
      } else {
        return {
          ...item,
          user_type: item.visibility ? 2 : 3
        }
      }
    }) ?? []
  )
}

const ReadSettings = ({
  children,
  initFormData,
  updatePrice
}: {
  children: React.ReactNode
  initFormData?: iPostPrice[]
  updatePrice: (price: iPostPrice[]) => void
}) => {
  const [open, setIsOpen] = useState<boolean>(false)
  const selectOptions = [
    { label: "所有人", value: 0 },
    { label: "订阅者", value: 1 }
    // {label: "非订阅", value: 2}
  ]
  const priceForm = useForm<{ priceList: iPostPrice[] }>({
    mode: "all",
    resolver: zodResolver(
      z.object({
        priceList: postPriceSchema
      })
    ),
    defaultValues: {
      priceList: revertPriceSettingOption(initFormData ?? []) ?? []
    }
  })
  const { watch } = priceForm
  const { formState, trigger, getValues, control } = priceForm
  const {
    fields: priceList,
    append,
    remove
  } = useFieldArray({
    control,
    name: "priceList"
  })
  const formValues = watch()
  const userType = watch(`priceList.${0}.user_type`)

  const disableOption2 = userType === 0

  const settings2SelectOptions = useMemo(() => {
    if (userType === 0) {
      return []
    }
    if (userType === 1) {
      return [
        { label: "非订阅者", value: 2 },
        { label: "非订阅者无法浏览", value: 3 } // 特殊处理
      ]
    }
    return []
  }, [userType])

  useEffect(() => {
    if (formValues.priceList.length === 0) {
      append({ price: 0, user_type: 0, visibility: true })
    }
  }, [append, formValues.priceList.length])

  useEffect(() => {
    if (userType === 1 && formValues.priceList.length === 1) {
      append({
        price: 0,
        user_type: 2,
        visibility: true
      })
    }

    if (userType === 0 && formValues.priceList.length === 2) {
      remove(1)
    }
  }, [append, formValues.priceList.length, remove, userType])

  const { errors } = formState

  return (
    <>
      <button
        onTouchEnd={() => {
          setIsOpen(true)
        }}
      >
        {children}
      </button>
      <FormDrawer
        isOpen={open}
        setIsOpen={setIsOpen}
        outerControl
        title={"阅览设置"}
        headerLeft={(close) => {
          return (
            <button onTouchEnd={close} className={"text-base text-[#777]"}>
              <IconWithImage
                url={"/icons/profile/icon_close@3x.png"}
                width={24}
                height={24}
                color={"#000"}
              />
            </button>
          )
        }}
        headerRight={() => {
          return (
            <button
              type={"button"}
              onTouchEnd={() => {
                trigger().then((valid) => {
                  if (valid) {
                    const data = getValues()
                    updatePrice(
                      data.priceList.map((item) => {
                        return {
                          ...item,
                          price: Number(item.price),
                          ...transformPriceSettingOption(item.user_type)
                        } as iPostPrice
                      })
                    )
                    setIsOpen(false)
                  }
                })
              }}
              className={"text-base text-main-pink"}
            >
              确定
            </button>
          )
        }}
        trigger={children}
      >
        {priceList.map((item, index) => {
          return (
            <section
              className={clsx("px-4 mt-5", disableOption2 && index === 1 ? "opacity-40" : "")}
              key={item.id}
            >
              <h3>
                付费设置{index + 1} {disableOption2 && index === 1 ? "(无效)" : ""}
              </h3>
              <Controller
                render={({ field }) => {
                  return (
                    <FormItemWithSelect
                      label={"付费对象"}
                      value={field.value}
                      onValueChange={field.onChange}
                      options={
                        index === 0 ? selectOptions : (settings2SelectOptions as ISelectOption[])
                      }
                    />
                  )
                }}
                control={control}
                name={`priceList.${index}.user_type`}
              />
              {/*<FormItemWithSelect label={"付费金额"} value={"0"} options={[{label: "0", value: "0"}, {label: "2", value: "2"}]}/>*/}
              <section className={"relative"}>
                <section className="flex justify-between items-center border-b border-[#ddd] py-4">
                  <div className="shrink-0">付费金额</div>
                  <Controller
                    control={control}
                    render={({ field }) => {
                      return (
                        <input
                          className="flex-1 text-right"
                          min={0}
                          value={field.value}
                          onChange={(event) => {
                            field.onChange(event.target.value.replace(/^0+(?=\d)/, ""))
                          }}
                          onBlur={(event) => {
                            field.onChange(Number(event.target.value).toFixed(2))
                          }}
                        />
                      )
                    }}
                    name={`priceList.${index}.price`}
                  />
                  <div className={"flex items-center justify-center gap-1.5 text-[#777]"}>
                    <IconWithImage
                      url={"/icons/profile/icon_arrow_right@3x.png"}
                      width={16}
                      height={16}
                      color={"#ddd"}
                    />
                  </div>
                </section>
                <section className="text-xs text-red-600 absolute right-4 bottom-0">
                  {errors.priceList?.[index]?.price?.message}
                </section>
              </section>
              <section className={"text-xs text-[#777] mt-1.5"}>金额0时，为免费</section>
            </section>
          )
        })}
      </FormDrawer>
    </>
  )
}

const IMAGE_PREFIX = `${process.env.NEXT_PUBLIC_API_URL}/media/img/`

const UploadMedia = () => {
  const { control } = useFormContext<iPost>()
  const ref = useRef<HTMLInputElement>(null)
  const {
    fields: itemsList,
    append,
    remove
  } = useFieldArray({
    control,
    name: "post_attachment"
  })
  const handleUpload = (file: File) => {
    uploadFile(file).then((data) => {
      console.log("upload file result: ",data)
      if (data) {
        append({
          file_id: data
        })
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        ref.current.value = null
      }
    })
  }
  return (
    <>
      {itemsList?.map((item, index) => {
        return (
          <Controller
            control={control}
            key={item.file_id}
            render={({ field }) => {
              return (
                <div
                  key={item.file_id}
                  className={
                    "relative w-[100px] h-[100px] flex items-center justify-center bg-[#F4F5F5] rounded "
                  }
                >
                  <Image
                    className={"rounded-xl"}
                    src={`${IMAGE_PREFIX}${field.value}`}
                    alt={"attachment"}
                    width={100}
                    height={100}
                  />
                  <button
                    className={"absolute right-[-4px] top-[-4px]"}
                    onTouchEnd={() => {
                      remove(index)
                    }}
                  >
                    <Image
                      alt={"delete"}
                      src={"/icons/profile/icon-delete.png"}
                      width={16}
                      height={16}
                    />
                  </button>
                </div>
              )
            }}
            name={`post_attachment.${index}.file_id`}
          />
        )
      })}
      <div className="relative w-[100px] h-[100px] flex items-center justify-center bg-[#F4F5F5] rounded ">
        <input
          ref={ref}
          type="file"
          multiple={false}
          className="block w-full h-full absolute left-0 top-0 opacity-0 z-10"
          onChange={(event) => {
            if (event.target.files?.length) {
              handleUpload(event.target.files[0])
            }
          }}
        />
        <IconWithImage
          url={"/icons/profile/icon_add@3x.png"}
          width={24}
          height={24}
          color={"#000"}
        />
        <div className="text-[#bbb] text-xs text-center absolute bottom-2">视频/图片</div>
      </div>
    </>
  )
}

const initPostFormData: iPost = {
  post: {
    notice: false,
    title: ""
  },
  post_attachment: [],
  post_price: [
    {
      price: 0,
      user_type: 0,
      visibility: true
    }
  ],
  post_vote: undefined
}

const ReadingSettingsDisplay = ({ postPrice }: { postPrice: iPostPrice }) => {
  const selectOptions = [
    { label: "所有人", value: 0, visibility: true },
    { label: "订阅者", value: 1, visibility: true },
    { label: "非订阅者", value: 2, visibility: true },
    { label: "非订阅者无法浏览", value: 2, visibility: false }
  ]
  const { price, user_type, visibility } = postPrice
  const option = selectOptions.find(
    (item) => item.value === user_type && item.visibility === visibility
  )
  return (
    <section className="flex items-center space-x-2">
      <IconWithImage
        url={"/icons/profile/icon-reading.png"}
        width={20}
        height={20}
        color={"#FF8492"}
      />
      <label className={"text-main-pink"}>
        {option?.label}
        {Number(price) === 0 ? "免费" : price}
      </label>
    </section>
  )
}

export default function Page() {
  const router = useRouter()
  const onFormSubmit = (formData: iPost) => {
    addPost(formData).then((data) => {
      if (data?.code === 0) {
        router.back()
      }
    })
  }

  const postForm = useForm<iPost>({
    mode: "onTouched",
    resolver: zodResolver(postSchema),
    defaultValues: { ...initPostFormData }
  })
  const { register, watch, formState, setValue, handleSubmit } = postForm

  const noticeRegister = register("post.notice")

  const formValues = watch()

  return (
    <FormProvider {...postForm}>
      <form onSubmit={handleSubmit(onFormSubmit)}>
        <section className="flex justify-between h-11 items-center pl-4 pr-4 ">
          <ConfirmModal
            content={"未发布的内容是否保存到草稿中？"}
            confirm={() => {
              console.log("保存到草稿")
              router.back()
            }}
            cancel={router.back}
            trigger={
              <button>
                <IconWithImage
                  url={"/icons/profile/icon_close@3x.png"}
                  width={24}
                  height={24}
                  color={"#000"}
                />
              </button>
            }
          />
          <button type="submit" className={clsx(!formState.isValid ? "text-[#bbb]" : "#000")}>
            发布
          </button>
        </section>

        <section className="pt-5 pb-5 pl-4 pr-4 border-b border-gray-200 flex gap-2.5 flex-wrap">
          <UploadMedia />
        </section>
        <section className="pt-5 pb-5 pl-4 pr-4 border-b border-gray-200 relative">
          <textarea
            {...register("post.title")}
            className="resize-none block w-full"
            maxLength={999}
            placeholder="分享我的感受"
            rows={5}
          />
          <div className="absolute left-4 bottom-1.5 text-red-600 text-xs">
            {formState?.errors?.post?.title?.message}
          </div>
        </section>
        {watch("post_vote") !== undefined && (
          <section className="pt-5 pb-5 pl-4 pr-4 border-b border-gray-200">
            <section className="flex justify-between">
              <div className="flex gap-2.5 items-center">
                <div className="font-bold text-base">发起了一个投票:</div>
                <AddVoteModal
                  initFormData={formValues.post_vote}
                  updateVoteData={(data) => {
                    setValue("post_vote", data)
                  }}
                >
                  <IconWithImage
                    url={"/icons/profile/icon_edit@3x.png"}
                    width={20}
                    height={20}
                    color={"#bbb"}
                  />
                </AddVoteModal>
              </div>
              <button
                onTouchEnd={() => {
                  setValue("post_vote", undefined)
                }}
              >
                <IconWithImage
                  url={"/icons/profile/icon_close@3x.png"}
                  width={24}
                  height={24}
                  color={"#000"}
                />
              </button>
            </section>
            <section className="mt-2.5 rounded-xl bg-[#F4F5F5] px-3 py-2">
              <div className="flex gap-2.5 items-center">
                <IconWithImage
                  url={"/icons/profile/icon_fans_vote@3x.png"}
                  width={20}
                  height={20}
                  color={"#FF8492"}
                />
                <span className="font-bold text-main-pink text-base">
                  {formValues.post_vote?.title}
                </span>
              </div>
              <div className="text-xs text-[#999] mt-1.5">
                截止：
                {formValues.post_vote?.stop_time
                  ? dayjs(formValues.post_vote?.stop_time).format("YYYY-MM-DD HH:mm")
                  : ""}{" "}
                结束
              </div>
            </section>
          </section>
        )}
        <section className="pt-5 pb-5 pl-4 pr-4 border-b border-gray-200">
          {/*<ItemEditTitle title={"阅览设置："}/>*/}
          <div className="flex gap-2.5 items-center">
            <div className="font-bold text-base">阅览设置：</div>
            <ReadSettings
              initFormData={formValues.post_price}
              updatePrice={(value) => {
                setValue("post_price", value)
              }}
            >
              <IconWithImage
                url={"/icons/profile/icon_edit@3x.png"}
                width={20}
                height={20}
                color={"#bbb"}
              />
            </ReadSettings>
          </div>
          <section className="mt-2.5">
            {formValues.post_price?.map((price, index) => (
              <ReadingSettingsDisplay postPrice={price} key={index} />
            ))}
            {/*<div className="flex items-center space-x-2">*/}
            {/*    <IconWithImage url={"/icons/profile/icon-reading.png"} width={20} height={20}*/}
            {/*                   color={'#FF8492'}/>*/}
            {/*    <label className={"text-main-pink"}>免费订阅</label>*/}
            {/*</div>*/}
          </section>
        </section>
        <section className="pt-5 pb-5 pl-4 pr-4 ">
          <ItemEditTitle showIcon={false} title={"发布通知"} />
          <section className="border-b border-gray-200 flex justify-between items-center py-3">
            <div>订阅者</div>
            <Switch
              {...noticeRegister}
              onCheckedChange={(value) => {
                setValue("post.notice", value)
              }}
            ></Switch>
          </section>
        </section>
        <section className="text-center pb-5">
          <AddVoteModal
            updateVoteData={(data) => {
              setValue("post_vote", data, { shouldDirty: true, shouldTouch: true })
            }}
          >
            {watch("post_vote") === undefined && (
              <span className="inline-flex w-[165px] items-center justify-center rounded-xl gap-2 border border-main-pink py-2 text-main-pink text-base">
                <IconWithImage
                  url={"/icons/profile/icon_fans_vote@3x.png"}
                  width={20}
                  height={20}
                  color={"#FF8492"}
                />
                投票
              </span>
            )}
          </AddVoteModal>
        </section>
      </form>
    </FormProvider>
  )
}
