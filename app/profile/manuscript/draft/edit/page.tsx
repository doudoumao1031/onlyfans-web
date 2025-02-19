"use client"
import React, { HTMLAttributes, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react"
import clsx from "clsx"
import IconWithImage from "@/components/profile/icon"
import { Switch } from "@/components/ui/switch"
import { useRouter, useSearchParams } from "next/navigation"
import FormDrawer from "@/components/common/form-drawer"
import InputWithLabel from "@/components/profile/input-with-label"
import SheetSelect, { ISelectOption } from "@/components/common/sheet-select"
import ConfirmModal from "@/components/common/confirm-modal"
import { Controller, FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import dayjs from "dayjs"
import { z } from "zod"
import Image from "next/image"
import {
  addPost,
  iPost,
  iPostPrice,
  iPostVote,
  postDetail,
  postPriceSchema,
  postSchema,
  postVoteSchema, pubPost
} from "@/lib/actions/profile"
import { isNumber } from "lodash"
import { buildImageUrl, getUploadMediaFileType, UPLOAD_MEDIA_TYPE, uploadFile } from "@/lib/utils"
import DateTimePicker from "@/components/common/date-time-picker"
import { getFollowedUsers, SubscribeUserInfo } from "@/lib"
import Empty from "@/components/common/empty"
import useCommonMessage, { CommonMessageContext, useCommonMessageContext } from "@/components/common/common-message"

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
      <div className="flex-1">
        <SheetSelect outerControl={false} options={options} onInputChange={onValueChange}>
          <div className={"flex items-center justify-end gap-1.5 text-[#777]"}>
            <span>{showLabel}</span>
            <IconWithImage
              url={"/icons/profile/icon_arrow_right@3x.png"}
              width={16}
              height={16}
              color={"#ddd"}
            />
          </div>
        </SheetSelect>
      </div>
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
  }, [append, voteForm])

  const minTime = new Date()

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
              className={"text-base text-text-pink"}
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
            {watch("items")?.filter(item => !!item.content)?.length < 2 && (
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
              className="flex gap-1.5 w-full rounded-xl border border-border-pink justify-center items-center py-2.5 text-text-pink"
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
            <div className={""}>
              <Controller
                control={control}
                render={({ field }) => {
                  return (
                    <DateTimePicker min={minTime} value={field.value * 1000} dateChange={value => {
                      field.onChange(value / 1000)
                    }}
                    >
                      <div
                        className={field.value ? "" : "text-gray-500"}
                      >{field.value ? dayjs(field.value * 1000).format("YYYY-MM-DD HH:mm") : "请选择"}</div>
                    </DateTimePicker>
                  )
                }}
                name={"stop_time"}
              />
            </div>
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
              className={"text-base text-text-pink"}
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

const UploadMedia = () => {
  const { showMessage } = useCommonMessageContext()
  const [uploading, setIsUploading] = useState<boolean>(false)
  const [firstMediaType,setFirstMediaType] = useState<UPLOAD_MEDIA_TYPE | undefined>(undefined)
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

  useEffect(() => {
    if (itemsList.length === 0) {
      setFirstMediaType(undefined)
    }
  },[itemsList])

  const handleUpload = (file: File) => {
    const fileType = getUploadMediaFileType(file)
    if (!firstMediaType) {
      setFirstMediaType(fileType)
    } else {
      if (fileType !== firstMediaType) {
        if (fileType === UPLOAD_MEDIA_TYPE.PIC) {
          showMessage("请先删除视频内容")
        }
        if (fileType === UPLOAD_MEDIA_TYPE.VIDEO) {
          showMessage("请先删除图片内容")
        }
        return
      }
    }
    setIsUploading(true)
    uploadFile(file).then((data) => {
      console.log("upload file result: ", data)
      if (data && data?.file_id) {
        append({
          file_id: data?.file_id,
          file_type: data?.file_type
        })
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        ref.current.value = null
      }
    }).finally(() => {
      setIsUploading(false)
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
                    "relative w-[100px] h-[100px] flex items-center justify-center bg-[#F4F5F5]  "
                  }
                >
                  <section className={"h-full w-full overflow-hidden rounded"}>
                    <Image
                      className={"rounded-xl"}
                      src={buildImageUrl(field.value)}
                      alt={"attachment"}
                      width={100}
                      height={100}
                    />
                  </section>
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
      {uploading && (
        <div className={"w-[100px] h-[100px] flex items-center justify-center bg-[#F4F5F5] rounded "}>
          上传中...
        </div>
      )}
      {!uploading && itemsList.length < 9 && (
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
      )}
    </>
  )
}

const initPostFormData: iPost = {
  post: {
    notice: false,
    title: "",
    post_status: 2
  },
  post_attachment: [],
  post_price: [
    {
      price: 0,
      user_type: 0,
      visibility: true
    }
  ],
  post_mention_user: [],
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
      <label className={"text-text-pink"}>
        {option?.label}
        {Number(price) === 0 ? "免费" : price}
      </label>
    </section>
  )
}

function SelectMotionUser({
  isOpen, setIsOpen, updateMentionUserIds, subUsers
}: {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  subUsers: SubscribeUserInfo[],
  updateMentionUserIds: (id: number) => void
}) {
  const [filterValue, setFilterValue] = useState<string>("")

  const filteredData = useMemo(() => {
    if (!filterValue) return subUsers
    return subUsers.filter(item => item.user.username.includes(filterValue)) ?? []
  }, [filterValue, subUsers])

  return (
    <FormDrawer title={"已关注用户"} outerControl trigger={<></>} isOpen={isOpen} setIsOpen={setIsOpen}>
      <section className="h-full flex flex-col">
        <section className={"flex-shrink-0 px-4 mb-2.5"}>
          <input className={"block w-full rounded-full h-9 px-4 bg-[#f8f8f8]"} value={filterValue} onChange={event => {
            setFilterValue(event.target.value)
          }}
          />
        </section>
        <section className={"flex-1 overflow-y-scroll"}>
          <div className={"px-4"}>
            {filteredData.map(item => {
              return (
                <div key={item.user.id} className={"flex gap-4 items-center"}>
                  <Image src={buildImageUrl(item.user.photo)} alt={"avatar"} width={40} height={40}
                    className={"rounded-full shrink-0"}
                  />
                  <button onTouchEnd={() => {
                    updateMentionUserIds(item.user.id)
                  }} type={"button"} className={"flex-1 flex justify-between border-b border-[#ddd] py-3 "}
                  >
                    <section className={"text-left"}>
                      <div className={"text-base text-[#222] font-medium"}>{item.user.username}</div>
                      <div
                        className={"text-xs text-[#bbb]"}
                      >{dayjs(item.start_time).format("YYYY-MM-DD HH:mm")}</div>
                    </section>
                  </button>
                </div>
              )
            })
            }
            {filteredData.length === 0 && <Empty text={"暂无数据"}/>}
          </div>
        </section>
      </section>
    </FormDrawer>
  )
}

const insertString = (str: string, index: number, char: string) => {
  return str.substring(0, index) + char + str.substring(index + 1)
}

const Page = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <EditPageContent/>
    </Suspense>
  )
}

const EditPageContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const postId = Number(searchParams.get("id"))
  const [subUsers, setSubUsers] = useState<SubscribeUserInfo[]>([])
  const { showMessage, renderNode } = useCommonMessage()
  useEffect(() => {
    getFollowedUsers({ page: 1, pageSize: 10, from_id: 0 }).then(response => {
      if (!response) return
      setSubUsers(response.list ?? [])
    })
  }, [])
  const selectionStart = useRef<number>(0)

  const getSubmitFormData = (formData:iPost) => {
    const { post_mention_user = [], post: { title } } = formData
    const mentionUsers = post_mention_user?.map(item => subUsers.find(sub => sub.user.id === item.user_id))?.filter(item => !!item)
    const mentionUserIds = mentionUsers.filter(item => {
      return title?.includes(`@${item?.user?.username} `)
    }).map(user => ({ user_id: user.user.id }))
    return {
      ...formData,
      post_mention_user: mentionUserIds
    }
  }
  const onFormSubmit = (formData: iPost) => {
    const params = getSubmitFormData(formData)
    addPost(params).then((data) => {
      if (data?.code === 0 && data?.data?.post?.id) {
        pubPost(data.data.post.id).then(() => {
          showMessage("success")
          router.back()
        })
      } else {
        showMessage(data?.message)
      }
    })
  }

  const postForm = useForm<iPost>({
    mode: "all",
    resolver: zodResolver(postSchema),
    defaultValues: (isNumber(postId) && postId > 0) ? () => {
      return postDetail(postId).then(data => {
        if (data) {
          return {
            ...data.data,
            post_vote: data.data.post_vote ?? undefined
          }
        }
        return initPostFormData
      })
    } : { ...initPostFormData }
  })

  const { register, watch, formState, setValue, handleSubmit } = postForm

  const noticeRegister = register("post.notice")

  const formValues = watch()
  const [atUserModal, setAtUserModal] = useState<boolean>(false)

  const updateMentionUserIds = useCallback((id: number) => {
    const value = formValues.post_mention_user ?? []
    value.push({ user_id: id })
    setValue("post_mention_user", [...new Set(value)])
    const appendUsername = subUsers.find(item => item.user.id === id)?.user?.username ?? ""
    const insertedString = insertString(formValues?.post?.title ?? "", selectionStart.current, appendUsername + " ")
    setValue("post.title", insertedString)
    setAtUserModal(false)
  }, [formValues, setValue, subUsers])

  const handleSaveDraft = () => {
    addPost(getSubmitFormData(formValues)).then(() => {
      showMessage("success")
      router.back()
    })
  }

  const showSaveDraft = useMemo(() => {
    const title = formValues.post?.title
    const attachments = formValues.post_attachment
    return !!title || !!attachments?.length
  },[formValues])

  return (
    <CommonMessageContext.Provider value={useMemo(() => ({ showMessage }), [showMessage])}>
      {renderNode}
      <FormProvider {...postForm}>
        <SelectMotionUser isOpen={atUserModal} setIsOpen={setAtUserModal}
          subUsers={subUsers}
          updateMentionUserIds={updateMentionUserIds}
        />
        <form onSubmit={handleSubmit(onFormSubmit)}>
          <section className="flex justify-between h-11 items-center pl-4 pr-4">
            {
              showSaveDraft ? (
                <ConfirmModal
                  content={"未发布的内容是否保存到草稿中？"}
                  confirm={handleSaveDraft}
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
              )
                : (
                  <button onTouchEnd={router.back}>
                    <IconWithImage
                      url={"/icons/profile/icon_close@3x.png"}
                      width={24}
                      height={24}
                      color={"#000"}
                    />
                  </button>
                )
            }
            <button type="submit" className={clsx(!formState.isValid ? "text-[#bbb]" : "text-text-pink")}>
              发布
            </button>
          </section>


          <section className="pt-5 pb-5 pl-4 pr-4 border-b border-gray-200 flex gap-2.5 flex-wrap">
            <UploadMedia/>
          </section>
          <section className="pt-5 pb-5 pl-4 pr-4 border-b border-gray-200 relative">
            <textarea
              {...register("post.title")}
              className="resize-none block w-full"
              maxLength={999}
              placeholder="分享我的感受"
              rows={5}
              onKeyUp={event => {
                if (event.key === "@") {
                  selectionStart.current = (event.target as HTMLTextAreaElement).selectionStart
                  setAtUserModal(true)
                }
              }}
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
                  <span className="font-bold text-text-pink text-base">
                    {formValues.post_vote?.title}
                  </span>
                </div>
                <div className="text-xs text-[#999] mt-1.5">
                  截止：
                  {formValues.post_vote?.stop_time
                    ? dayjs(formValues.post_vote?.stop_time * 1000).format("YYYY-MM-DD HH:mm")
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
                <ReadingSettingsDisplay postPrice={price} key={index}/>
              ))}
              {/*<div className="flex items-center space-x-2">*/}
              {/*    <IconWithImage url={"/icons/profile/icon-reading.png"} width={20} height={20}*/}
              {/*                   color={'#FF8492'}/>*/}
              {/*    <label className={"text-text-pink"}>免费订阅</label>*/}
              {/*</div>*/}
            </section>
          </section>
          <section className="pt-5 pb-5 pl-4 pr-4 ">
            <ItemEditTitle showIcon={false} title={"发布通知"}/>
            <section className="border-b border-gray-200 flex justify-between items-center py-3">
              <div>订阅者</div>
              <Switch
                className={"custom-switch"}
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
              {!watch("post_vote") && (
                <span
                  className="inline-flex w-[165px] items-center justify-center rounded-xl gap-2 border border-[#999] py-2 text-[#999] text-base"
                >
                  <IconWithImage
                    url={"/icons/profile/icon_fans_vote@3x.png"}
                    width={20}
                    height={20}
                    color={"#999"}
                  />
                  投票
                </span>
              )}
            </AddVoteModal>
          </section>
        </form>
      </FormProvider>
    </CommonMessageContext.Provider>
  )
}

export default Page