"use client"
import React, { HTMLAttributes, Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import dayjs from "dayjs"
import { isEmpty, isNumber } from "lodash"
import { useTranslations } from "next-intl"
import { Controller, FormProvider, useFieldArray, useForm, useFormContext } from "react-hook-form"
import { z } from "zod"

import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"


import CommonAvatar from "@/components/common/common-avatar"
import { useCommonMessageContext } from "@/components/common/common-message"
import ConfirmModal from "@/components/common/confirm-modal"
import DateTimePicker from "@/components/common/date-time-picker"
import Empty from "@/components/common/empty"
import FormDrawer from "@/components/common/form-drawer"
import SheetSelect, { ISelectOption } from "@/components/common/sheet-select"
import IconWithImage from "@/components/profile/icon"
import InputWithLabel from "@/components/profile/input-with-label"
import { MediaPreview, PreviewType } from "@/components/profile/manuscript/media-preview"
import { Switch } from "@/components/ui/switch"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import { FansFollowItem, FileType, getFollowedUsers } from "@/lib"
import {
  addPost,
  iPost,
  iPostAttachment,
  iPostPrice,
  iPostVote,
  postDetail,
  postPriceSchema,
  postSchema,
  postVoteSchema,
  pubPost
} from "@/lib/actions/profile"
import { revalidateProfileData } from "@/lib/actions/revalidate/actions"
import { ZH_YYYY_MM_DD_HH_mm } from "@/lib/constant"
import { buildImageUrl, getUploadMediaFileType, uploadFile } from "@/lib/utils"

const ItemEditTitle = ({
  title,
  showIcon = true
}: {
  title: React.ReactNode
  showIcon?: boolean
}) => {
  return (
    <div className="flex items-center gap-2.5">
      <div className="text-base font-bold">{title}</div>
      {showIcon && (
        <IconWithImage
          url={"/theme/icon_fans_edit_red@3x.png"}
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
    <section className="flex items-center justify-between border-b border-[#ddd] py-4">
      <div>{label}</div>
      <div className="flex-1">
        <SheetSelect outerControl={false} options={options} onInputChange={onValueChange}>
          <div className={"flex items-center justify-end gap-1.5"}>
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
  const defaultStopTime = Math.floor(dayjs().add(1, "day").endOf("day").valueOf() / 1000)
  const voteForm = useForm<iPostVote>({
    mode: "all",
    resolver: zodResolver(postVoteSchema),
    defaultValues: initFormData ?? {
      items: [],
      title: "",
      stop_time: defaultStopTime,
      mu_select: false
    }
  })
  const { formState, watch, reset, trigger, getValues, control } = voteForm
  const { fields: itemsList, append, remove } = useFieldArray({
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

  const t = useTranslations("Profile")
  const commonTrans = useTranslations("Common")

  return (
    <>
      <button
        type={"button"}
        onTouchEnd={() => {
          setIsOpen(true)
        }}
      >
        {children}
      </button>
      <FormDrawer
        title={t("manuscript.itemActions.addVote")}
        isOpen={open}
        setIsOpen={setIsOpen}
        outerControl
        headerLeft={(close) => {
          return (
            <button type={"button"} onTouchEnd={close} className={"text-base text-[#777]"}>
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
              className={"text-text-theme text-base"}
            >
              {commonTrans("confirm")}
            </button>
          )
        }}
        trigger={children}
      >
        <section className={"relative border-b border-[#ddd] px-4 py-5"}>
          <Controller
            control={control}
            render={({ field }) => {
              return (
                <InputWithLabel
                  value={field.value}
                  onInputChange={field.onChange}
                  label={t("manuscript.itemActions.voteTitle")}
                  maxLength={15}
                />
              )
            }}
            name="title"
          />
          <div className=" text-theme absolute bottom-0 left-8 text-xs">
            {formState.errors.title?.message}
          </div>
        </section>
        <section className={"border-b border-[#ddd] px-4 py-5"}>
          <h3 className="mb-2 text-base font-medium">
            {t("manuscript.itemActions.voteContent")}
            {watch("items")?.filter(item => !!item.content)?.length < 2 && (
              <span className="text-theme ml-2 text-xs font-normal">{t("manuscript.itemActions.voteContentMin")}</span>
            )}
          </h3>
          <section className="mt-2 flex flex-col gap-5">
            {itemsList.map((field, index) => {
              return (
                <div className={"relative"} key={field.id}>
                  <Controller
                    name={`items.${index}.content`}
                    control={control}
                    render={({ field, fieldState }) => {
                      return (
                        <InputWithLabel
                          errorMessage={fieldState.error?.message}
                          value={field.value}
                          onInputChange={field.onChange}
                          maxLength={20}
                          label={`${t("manuscript.itemActions.voteOption")}${index + 1}`}
                        />
                      )
                    }}
                  />
                  {itemsList.length > 2 && (
                    <button type={"button"} className={"absolute -right-2 -top-2 z-20 p-1"} onTouchEnd={() => {
                      remove(index)
                    }}
                    >
                      <img alt={"delete"} src={"/theme/icon_fans_delete@3x.png"} width={16} height={16} />
                    </button>
                  )}
                </div>
              )
            })}
            {
              itemsList.length < 9 && (
                <button
                  type={"button"}
                  onTouchEnd={() => {
                    append({ content: "" })
                  }}
                  className="border-border-theme text-text-theme flex w-full items-center justify-center gap-1.5 rounded-xl border py-2.5"
                >
                  <IconWithImage
                    url={"/icons/profile/icon_add@3x.png"}
                    className={"bg-theme"}
                    width={20}
                    height={20}
                  />
                  {t("manuscript.itemActions.addVoteOption")}
                </button>
              )
            }
          </section>
        </section>
        <section className="px-4">
          <Controller
            control={control}
            render={({ field }) => {
              return (
                <FormItemWithSelect
                  onValueChange={field.onChange}
                  label={t("manuscript.itemActions.voteSelect")}
                  value={field.value}
                  options={[
                    { label: t("manuscript.itemActions.voteSelectSingle"), value: false },
                    { label: t("manuscript.itemActions.voteSelectMultiple"), value: true }
                  ]}
                />
              )
            }}
            name={"mu_select"}
          />
          <section className="flex items-center justify-between border-b border-[#ddd] py-4">
            <div>{t("manuscript.itemActions.voteEndTime")}</div>
            <div className={""}>
              <Controller
                control={control}
                render={({ field }) => {
                  return (
                    <DateTimePicker min={minTime} value={field.value * 1000} dateChange={value => {
                      field.onChange(Math.floor(value / 1000))
                    }}
                    >
                      <div className={"flex items-center gap-1.5"}>
                        <div>{field.value ? dayjs(field.value * 1000).format(ZH_YYYY_MM_DD_HH_mm) : "请选择"}</div>
                        <IconWithImage
                          url={"/icons/profile/icon_arrow_right@3x.png"}
                          width={16}
                          height={16}
                          color={"#ddd"}
                        />
                      </div>
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
  const t = useTranslations("Profile")
  const commonTrans = useTranslations("Common")
  const [open, setIsOpen] = useState<boolean>(false)
  const selectOptions = [
    { label: t("manuscript.itemActions.priceSelectAll"), value: 0 },
    { label: t("manuscript.itemActions.priceSelectSubscriber"), value: 1 }
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
        { label: t("manuscript.itemActions.priceSelectNonSubscriber"), value: 2 },
        { label: t("manuscript.itemActions.priceSelectNonSubscriberCannotView"), value: 3 } // 特殊处理
      ]
    }
    return []
  }, [t, userType])

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
        type={"button"}
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
        title={t("manuscript.itemActions.priceSetting")}
        headerLeft={(close) => {
          return (
            <button type={"button"} onTouchEnd={close} className={"text-base text-[#777]"}>
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
              className={"text-text-theme text-base"}
            >
              {commonTrans("confirm")}
            </button>
          )
        }}
        trigger={children}
      >
        {priceList.map((item, index) => {
          return (
            <section
              className={clsx("mt-5 px-4", disableOption2 && index === 1 ? "opacity-40" : "")}
              key={item.id}
            >
              <h3>
                {t("manuscript.paySetting")} {index + 1} {disableOption2 && index === 1 ? `(${t("manuscript.invalid")})` : ""}
              </h3>
              <Controller
                render={({ field }) => {
                  return (
                    <FormItemWithSelect
                      label={t("manuscript.payObject")}
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
                <section className="flex items-center justify-between border-b border-[#ddd] py-4">
                  <div className="shrink-0">{t("manuscript.payPrice")}</div>
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
                <section className="text-theme absolute bottom-0 right-4 text-xs">
                  {errors.priceList?.[index]?.price?.message}
                </section>
              </section>
              <section className={"mt-1.5 text-xs text-[#777]"}>{t("manuscript.priceFree")}</section>
            </section>
          )
        })}

        <div className={"text-text-desc mt-10 text-center"}>
          {t("manuscript.settingsEffective")}
        </div>
      </FormDrawer>
    </>
  )
}


interface LocalPreviewMediaProps {
  mediaType: FileType
  media: File
  index: number
}

const FirstFrameImage = ({ file, fileId }: { file: File | undefined, fileId?: string }) => {
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    if (canvasRef.current && file) {
      const videoElement = document.createElement("video")
      videoElement.preload = "metadata"
      const canvas = canvasRef.current
      videoElement.onloadeddata = () => {
        videoElement.currentTime = 0.1
      }

      videoElement.onseeked = () => {
        canvas.width = videoElement.videoWidth
        canvas.height = videoElement.videoHeight
        const ctx = canvas.getContext("2d")
        if (ctx) {
          ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height)
          setImageSrc(canvas.toDataURL("image/png"))
        }
      }
      videoElement.src = URL.createObjectURL(file)
    }
  }, [file])

  if (fileId) {
    return (
      <Image
        className={"max-h-full max-w-full object-contain"}
        src={buildImageUrl(fileId)}
        alt={"attachment"}
        width={100}
        height={100}
      />
    )
  }
  if (!file) {
    return (
      <Image
        className={"max-h-full max-w-full object-contain"}
        src={"/icons/image_draft.png"}
        alt={"attachment"}
        width={100}
        height={100}
      />
    )
  }
  return (
    <div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
      {imageSrc && (
        <Image
          className={"max-h-full max-w-full object-contain"}
          src={imageSrc}
          alt={"attachment"}
          width={100}
          height={100}
        />
      )
      }
    </div>
  )
}

const UploadMedia = () => {
  const { showMessage } = useCommonMessageContext()
  const t = useTranslations("Profile")
  const [uploading, setIsUploading] = useState<boolean>(false)
  const [firstMediaType, setFirstMediaType] = useState<FileType | undefined>(undefined)
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

  const [localPreviews, setLocalPreviews] = useState<LocalPreviewMediaProps[]>([])

  useEffect(() => {
    if (itemsList.length === 0) {
      setFirstMediaType(undefined)
    }
  }, [itemsList])

  const handleUpload = useCallback((file: File) => {
    const fileType = getUploadMediaFileType(file)
    if (fileType === FileType.Other) {
      showMessage(t("manuscript.itemActions.notSupport"))
      return
    }
    if (!firstMediaType) {
      setFirstMediaType(fileType)
    } else {
      if (fileType !== firstMediaType) {
        if (fileType === FileType.Image) {
          showMessage(t("manuscript.deleteVideoContent"))
        }
        if (fileType === FileType.Video) {
          showMessage(t("manuscript.deleteImageContent"))
        }
        return
      }
    }
    setIsUploading(true)
    uploadFile(file).then((data) => {
      if (data && data?.file_id) {
        append({
          file_id: data?.file_id,
          file_type: data?.file_type
        })
        if (ref?.current) {
          ref.current.value = ""
        }
        setLocalPreviews(prevState => {
          return [
            ...prevState,
            {
              media: file,
              mediaType: fileType,
              index: itemsList.length
            }
          ]
        })
      } else {
        showMessage(t("manuscript.uploadFail"))
      }
    }).finally(() => {
      setIsUploading(false)
    })
  }, [append, firstMediaType, showMessage, t, localPreviews])

  // const localPreviewMedia = useState<File | null>(null)
  const [localPreview, setLocalPreview] = useState<File>()
  const [openState, setOpenState] = useState<boolean>(false)
  const [previewType, setPreviewType] = useState<PreviewType>(PreviewType.LOCAL)
  const [previewMediaType, setPreviewMediaType] = useState<FileType>()
  const [previewFileId, setPreviewFileId] = useState<string>("")

  const adjustLocalPreviewIndex = (start: number) => {
    const clone = [...localPreviews]
    clone.forEach((localPreview, index) => {
      if (index >= start) {
        localPreview.index--
      }
    })
    const data = clone.filter(item => item.index > -1)
    setLocalPreviews(data)
  }

  const openPreview = (index: number, attachment: iPostAttachment) => {
    const previewItem = localPreviews.find(item => item.index === index)
    if (previewItem) {
      setPreviewType(PreviewType.LOCAL)
      setLocalPreview(previewItem.media)
      setPreviewMediaType(previewItem.mediaType)
    } else {
      setPreviewType(PreviewType.ONLINE)
      setPreviewFileId(attachment.file_id)
      setPreviewMediaType(attachment.file_type)
    }
    setOpenState(true)
  }

  return (
    <>
      <MediaPreview fileId={previewFileId} previewType={previewType} mediaType={previewMediaType} openState={openState}
        setOpenState={setOpenState} media={localPreview}
      />
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
                    "relative flex size-[100px] items-center justify-center rounded bg-[#F4F5F5] "
                  }
                  onTouchEnd={() => {
                    openPreview(index, field.value)
                  }}
                >
                  <section className={"flex size-full items-center overflow-hidden"}>
                    {
                      field.value.file_type === FileType.Image && (
                        <Image
                          className={"max-h-full max-w-full object-contain"}
                          src={buildImageUrl(field.value.file_id)}
                          alt={"attachment"}
                          width={100}
                          height={100}
                        />
                      )
                    }
                    {
                      field.value.file_type === FileType.Video && (
                        <FirstFrameImage file={localPreviews.find(item => item.index === index)?.media} fileId={field.value.thumb_id} />
                      )
                    }
                  </section>
                  <button
                    type={"button"}
                    className={"absolute right-[-4px] top-[-4px]"}
                    onTouchEnd={(event) => {
                      // event.preventDefault()
                      event.stopPropagation()
                      remove(index)
                      adjustLocalPreviewIndex(index)
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
            name={`post_attachment.${index}`}
          />
        )
      })}
      {uploading && (
        <div className={"flex size-[100px] items-center justify-center rounded bg-[#F4F5F5] "}>
          {t("manuscript.uploading")}
        </div>
      )}
      {!uploading && itemsList.length < 9 && (
        <div className="relative flex size-[100px] items-center justify-center rounded bg-[#F4F5F5] ">
          <input
            ref={ref}
            type="file"
            multiple={false}
            className="absolute left-0 top-0 z-10 block size-full opacity-0"
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
          <div className="absolute bottom-2 text-center text-xs">{t("manuscript.videoImage")}</div>
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
  const t = useTranslations("Profile")
  const selectOptions = [
    { label: t("manuscript.itemActions.priceSelectAll"), value: 0, visibility: true },
    { label: t("manuscript.itemActions.priceSelectSubscriber"), value: 1, visibility: true },
    { label: t("manuscript.itemActions.priceSelectNonSubscriber"), value: 2, visibility: true },
    { label: t("manuscript.itemActions.priceSelectNonSubscriberCannotView"), value: 2, visibility: false }
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
        className={"bg-theme"}
      />
      <label className={"text-text-theme"}>
        {option?.label}&nbsp;
        {Number(price) === 0 ? t("manuscript.free") : price}
      </label>
    </section>
  )
}

function SelectMotionUser({
  isOpen, setIsOpen, updateMentionUserIds, subUsers
}: {
  isOpen: boolean
  setIsOpen: (val: boolean) => void
  subUsers: FansFollowItem[],
  updateMentionUserIds: (id: number) => void
}) {
  const t = useTranslations("Profile")
  const [filterValue, setFilterValue] = useState<string>("")

  const filteredData = useMemo(() => {
    if (!filterValue) return subUsers
    return subUsers.filter(item => item.user.username.includes(filterValue)) ?? []
  }, [filterValue, subUsers])

  return (
    <FormDrawer title={t("manuscript.motionUser")} outerControl trigger={<></>} isOpen={isOpen} setIsOpen={setIsOpen}>
      <section className="flex h-full flex-col">
        <section className={"mb-2.5 shrink-0 px-4"}>
          <input className={"block h-9 w-full rounded-full bg-[#f8f8f8] px-4"} value={filterValue} onChange={event => {
            setFilterValue(event.target.value)
          }}
          />
        </section>
        <section className={"flex-1 overflow-y-scroll"}>
          <div className={"px-4"}>
            {filteredData.map(item => {
              return (
                <div key={item.user.id} className={"flex items-center gap-4"}>
                  <CommonAvatar photoFileId={item.user.photo} size={40} />
                  <button onTouchEnd={() => {
                    updateMentionUserIds(item.user.id)
                  }} type={"button"} className={"flex flex-1 justify-between border-b border-[#ddd] py-3 "}
                  >
                    <section className={"text-left"}>
                      <div className={"text-base font-medium text-[#222]"}>{item.user.username}</div>
                      <div
                        className={"text-xs text-[#bbb]"}
                      >{dayjs(item.following_time * 1000).format(ZH_YYYY_MM_DD_HH_mm)}</div>
                    </section>
                  </button>
                </div>
              )
            })
            }
            {filteredData.length === 0 && <Empty text={"暂无数据"} />}
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
      <EditPageContent />
    </Suspense>
  )
}


const EditPageContent = () => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const postId = Number(searchParams.get("id"))
  const [subUsers, setSubUsers] = useState<FansFollowItem[]>([])
  const { showMessage } = useCommonMessageContext()
  const titleInFocus = useRef<boolean>(false)
  const [formDefaultData, setFormDefaultData] = useState<iPost>()

  useEffect(() => {
    getFollowedUsers({ page: 1, pageSize: 10, from_id: 0 }).then(response => {
      if (!response) return
      setSubUsers(response.list ?? [])
    })
  }, [])
  const selectionStart = useRef<number>(0)
  const t = useTranslations("Profile")
  const commonTrans = useTranslations("Common")

  const DEFAULT_POST_TITLE = useMemo(() => {
    return {
      [FileType.Image]: t("manuscript.viewPic"),
      [FileType.Video]: t("manuscript.viewVideo"),
      [FileType.Other]: ""
    }
  }, [t])
  const getSubmitFormData = (formData: iPost) => {
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

  const { withLoading } = useLoadingHandler({
    onError: (message) => {
      showMessage(typeof message === "string" ? message : commonTrans("saveFail"), "error")
    },
    onSuccess: (message) => {
      showMessage(typeof message === "string" ? message : commonTrans("saveSuccess"), "success", {
        afterDuration: router.back
      })
    }
  })

  const onFormSubmit = async (formData: iPost) => {
    await withLoading(async () => {
      const params = getSubmitFormData(formData)
      let addPostResponse
      try {
        addPostResponse = await addPost(params)
      } catch {
        throw t("manuscript.publishFail")
      }
      if (addPostResponse?.code === 0 && addPostResponse?.data?.post?.id) {
        try {
          await pubPost(addPostResponse.data.post.id)
          await revalidateProfileData()
          return t("manuscript.publishSuccess")
        } catch {
          throw t("manuscript.publishFail")
        }
      } else {
        throw t("manuscript.publishFail")
      }
    })
  }

  const postForm = useForm<iPost>({
    mode: "all",
    resolver: zodResolver(postSchema),
    defaultValues: { ...initPostFormData }
  })
  useEffect(() => {
    console.log(postForm.formState.errors)
  }, [postForm.formState])

  const { register, watch, formState, setValue, handleSubmit: handleFormSubmit } = postForm

  const formValues = watch()
  const [atUserModal, setAtUserModal] = useState<boolean>(false)
  const isEdit = useMemo(() => {
    return isNumber(postId) && postId > 0
  }, [postId])

  const updateMentionUserIds = useCallback((id: number) => {
    const value = formValues.post_mention_user ?? []
    value.push({ user_id: id })
    setValue("post_mention_user", [...new Set(value)])
    const appendUsername = subUsers.find(item => item.user.id === id)?.user?.username ?? ""
    const insertedString = insertString(formValues?.post?.title ?? "", selectionStart.current, appendUsername + " ")
    setValue("post.title", insertedString)
    setAtUserModal(false)
  }, [formValues, setValue, subUsers])

  const handleSaveDraft = async () => {
    await withLoading(async () => {
      try {
        const result = await addPost(getSubmitFormData(formValues))
        if (result?.code === 0) {
          await revalidateProfileData()
        }
        return t("manuscript.saveDraftSuccess")
      } catch {
        throw t("manuscript.saveDraftFail")
      }
    })
  }

  useEffect(() => {
    if (isEdit) {
      postDetail(postId).then(data => {
        if (data) {
          const formData = data.data
          setFormDefaultData({
            ...data.data,
            post_vote: formData?.post_vote ?? undefined,
            post_attachment: formData?.post_attachment ?? undefined,
            post_mention_user: formData?.post_mention_user ?? undefined,
            post_price: formData?.post_price ?? undefined
          })
        }
      })
    }
  }, [postId, isEdit])

  useEffect(() => {
    if (formDefaultData) {
      postForm.reset(formDefaultData)
    }
  }, [formDefaultData, postForm])

  const showSaveDraft = useMemo(() => {
    if (isEdit) {
      return JSON.stringify(formValues) !== JSON.stringify(formDefaultData)
    } else {
      const title = formValues.post?.title
      const attachments = formValues.post_attachment
      return !!title || !!attachments?.length
    }

  }, [formValues, isEdit, formDefaultData])

  const post_attachment = (watch("post_attachment") ?? []).filter(item => !!item)
  const post_title = (watch("post.title") ?? "").trim()

  const canPublish = useMemo(() => {
    if (post_attachment?.length) {
      return true
    }
    return post_title.length > 4
  }, [post_title, post_attachment])

  //请浏览图片/请查看视频
  useEffect(() => {
    if (titleInFocus.current) {
      return
    }
    if (post_attachment.length && post_title === "") {
      const fileType = post_attachment[0].file_type
      setValue("post.title", DEFAULT_POST_TITLE[fileType])
      postForm.trigger()
    }
    const defaultTitles = Object.values(DEFAULT_POST_TITLE).filter(item => !!item)
    if (post_attachment.length === 0 && defaultTitles.includes(post_title)) {
      setValue("post.title", "")
    }
  }, [DEFAULT_POST_TITLE, postForm, post_attachment, post_title, setValue, titleInFocus])

  return (
    <FormProvider {...postForm}>
      <SelectMotionUser isOpen={atUserModal} setIsOpen={setAtUserModal}
        subUsers={subUsers}
        updateMentionUserIds={updateMentionUserIds}
      />
      <form onSubmit={handleFormSubmit(onFormSubmit)}>
        <section className="flex h-11 items-center justify-between px-4">
          {
            showSaveDraft ? (
              <ConfirmModal
                content={t("manuscript.saveDraftConfirm")}
                confirm={handleSaveDraft}
                cancel={router.back}
                trigger={
                  <button type={"button"}>
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
                <button type={"button"} onTouchEnd={router.back}>
                  <IconWithImage
                    url={"/icons/profile/icon_close@3x.png"}
                    width={24}
                    height={24}
                    color={"#000"}
                  />
                </button>
              )
          }
          <button type="submit" className={clsx((canPublish) ? "text-text-theme" : "text-[#bbb]")}>
            {t("manuscript.itemActions.publish")}
          </button>
        </section>


        <section className="flex flex-wrap gap-2.5 border-b border-gray-200 px-4 py-5">
          <UploadMedia />
        </section>
        <section className="relative border-b border-gray-200 px-4 py-5">
          <textarea
            {...register("post.title")}
            className="block w-full resize-none"
            maxLength={999}
            placeholder={t("manuscript.shareMyFeelings")}
            rows={5}
            onFocus={() => {
              titleInFocus.current = true
            }}
            onBlur={() => {
              titleInFocus.current = false
            }}
            onKeyUp={event => {
              if (event.key === "@") {
                selectionStart.current = (event.target as HTMLTextAreaElement).selectionStart
                setAtUserModal(true)
              }
            }}
          />
          <div className="text-theme absolute bottom-1.5 left-4 text-xs">
            {formState?.errors?.post?.title?.message}
          </div>
        </section>
        {!isEmpty(watch("post_vote")) && (
          <section className="border-b border-gray-200 px-4 py-5">
            <section className="flex justify-between">
              <div className="flex items-center gap-2.5">
                <div className="text-base font-bold">{t("manuscript.addedVote")}:</div>
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
                type={"button"}
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
              <div className="flex items-center gap-2.5">
                <IconWithImage
                  url={"/icons/profile/icon_fans_vote@3x.png"}
                  width={20}
                  height={20}
                  className={"bg-theme"}
                />
                <span className="text-text-theme text-base font-bold">
                  {formValues.post_vote?.title}
                </span>
              </div>
              <div className="mt-1.5 text-xs">
                截止：
                {formValues.post_vote?.stop_time
                  ? dayjs(formValues.post_vote?.stop_time * 1000).format(ZH_YYYY_MM_DD_HH_mm)
                  : ""}{" "}
                {t("manuscript.voteEndTime")}
              </div>
            </section>
          </section>
        )}
        <section className="border-b border-gray-200 px-4 py-5">
          {/*<ItemEditTitle title={"阅览设置："}/>*/}
          <div className="flex items-center gap-2.5">
            <div className="text-base font-bold">{t("manuscript.itemActions.priceSetting")}：</div>
            <ReadSettings
              initFormData={formValues.post_price}
              updatePrice={(value) => {
                setValue("post_price", value)
              }}
            >
              <IconWithImage
                url={"/theme/icon_fans_edit_red@3x.png"}
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
            {/*    <label className={"text-text-theme"}>免费订阅</label>*/}
            {/*</div>*/}
          </section>
        </section>
        <section className="px-4 py-5 ">
          <ItemEditTitle showIcon={false} title={t("manuscript.publishNotice")} />
          <section className="flex items-center justify-between border-b border-gray-200 py-3">
            <div>{t("manuscript.subscriber")}</div>
            <Controller control={postForm.control} render={({ field }) => {
              return (
                <Switch
                  className={"custom-switch"}
                  checked={field.value}
                  onCheckedChange={(value) => {
                    field.onChange(value)
                  }}
                />
              )
            }} name={"post.notice"}
            />
          </section>
        </section>
        <section className="pb-5 text-center">
          <AddVoteModal
            updateVoteData={(data) => {
              setValue("post_vote", data, { shouldDirty: true, shouldTouch: true })
            }}
          >
            {!watch("post_vote") && (
              <span
                className="border-theme text-theme inline-flex w-[165px] items-center justify-center gap-2 rounded-xl border py-2 text-base"
              >
                <IconWithImage
                  url={"/theme/icon_fans_vote_red@3x.png"}
                  width={20}
                  height={20}
                  color={"var(--theme)"}
                />
                {t("manuscript.vote")}
              </span>
            )}
          </AddVoteModal>
        </section>
      </form>
    </FormProvider>
  )
}

export default Page