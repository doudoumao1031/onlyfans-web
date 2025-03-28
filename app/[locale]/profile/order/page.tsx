"use client"
import React, { useEffect, useMemo, useRef, useState } from "react"

import { zodResolver } from "@hookform/resolvers/zod"
import clsx from "clsx"
import dayjs from "dayjs"
import { omit } from "lodash"
import { useTranslations } from "next-intl"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { useCommonMessageContext } from "@/components/common/common-message"
import DateTimePicker from "@/components/common/date-time-picker"
import Header from "@/components/common/header"
import ModalHeader from "@/components/common/modal-header"
import SheetSelect, { ISelectOption } from "@/components/common/sheet-select"
import IconWithImage from "@/components/profile/icon"
import InputWithLabel from "@/components/profile/input-with-label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"
import { Switch } from "@/components/ui/switch"
import { useLoadingHandler } from "@/hooks/useLoadingHandler"
import { useRouter } from "@/i18n/routing"
import {
  AddBundleDiscount,
  addSubscribeSetting,
  DiscountInfo,
  getSubscribeSetting,
  SubscribeSetting, updateSubscribeSettingItem, userApplyBlogger
} from "@/lib"
import { UserProfile, userProfile } from "@/lib/actions/profile"
import { addDiscount, baseSubscribe, bundlePriceSchema, bundleSubscribe } from "@/lib/actions/users/schemas"
import { ZH_YYYY_MM_DD_HH_mm } from "@/lib/constant"

const EditSubscriptionModal = ({ callback, userId, currentDiscounts, initData, openState, setOpenState, basePrice }: {
  callback: (data: DiscountInfo) => void,
  userId: number,
  currentDiscounts: AddBundleDiscount[],
  initData?: DiscountInfo,
  openState: boolean,
  setOpenState: (val: boolean) => void,
  basePrice: number
}) => {
  const t = useTranslations("Profile.order")
  const commonTrans = useTranslations("Common")
  const hasSub = currentDiscounts.filter(item => item.month_count !== undefined).map(item => item.month_count)

  const minId = useMemo(() => {
    const ids = currentDiscounts.map(item => item.id).filter(item => item !== undefined)
    return Math.min(...ids, 0)
  }, [currentDiscounts])

  const form = useForm<DiscountInfo>({
    mode: "all",
    resolver: zodResolver(bundleSubscribe),
    defaultValues: {
      ...(initData ?? {})
    }
  })

  const monthSelections = useMemo(() => {
    const arr = [2, 3, 6, 9, 12]
    return arr.map(month => {
      return {
        label: `${month}${t("monthUnit")}`,
        value: month
      }
    })
      .filter(item => !hasSub.includes(Number(item.value)))
  }, [hasSub, t])

  useEffect(() => {
    if (openState) {
      if (initData) {
        form.reset(initData)
      } else {
        const value = monthSelections.at(0)?.value
        if (value !== undefined) {
          form.reset({
            month_count: value,
            price: undefined
          })
        }
      }
    }
  }, [openState, form, initData])

  return (
    <Drawer open={openState} onOpenChange={setOpenState}>
      <DrawerContent className={"h-[95vh] bg-white"}>
        <section className={"flex-1"}>
          <DrawerHeader className={"hidden"}>
            <DrawerTitle></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <form onSubmit={form.handleSubmit(data => {
            callback({
              discount_end_time: initData?.discount_end_time ?? 0,
              discount_per: initData?.discount_per ?? 0,
              discount_price: initData?.discount_price ?? 0,
              discount_start_time: initData?.discount_start_time ?? 0,
              discount_status: initData?.discount_status ?? false,
              id: !initData ? minId - 1 : initData.id,
              item_status: initData?.item_status ?? false,
              user_id: userId,
              month_count: Number(data.month_count),
              price: Number(data.price)
            })
            setOpenState(false)
          })}
          >
            <ModalHeader title={t("bundleSub")}
              left={<button type={"button"} onTouchEnd={() => {
                setOpenState(false)
              }} className={"text-base"}
                    >{commonTrans("cancel")}</button>}
              right={(
                <button type={"submit"}
                  className={"text-text-theme text-base"}
                >{commonTrans("save")}</button>
              )}
            ></ModalHeader>

            <div className={"mt-5 block px-4"}>
              <Controller render={({ field, fieldState }) => {
                return (
                  initData ? (
                    <InputWithLabel placeholder={t("subTimeLimit")}
                      value={`${field.value} ${t("monthUnit")}${t("month")}`} disabled
                    />
                  ) : (
                    <InputWithLabel
                      errorMessage={fieldState.error?.message}
                      placeholder={t("subTimeLimit")}
                      onInputChange={(value) => {
                        field.onChange(value)
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        form.setValue("price", Number((Number(value) * basePrice)).toFixed(2))
                        form.trigger()
                      }}
                      options={monthSelections}
                      value={field.value ?? ""}
                    />
                  )
                )
              }} name={"month_count"} control={form.control}
              />
              <section className={"mt-[30px]"}>
                <Controller render={({ field }) => (
                  <InputWithLabel
                    errorMessage={form.formState.errors?.price?.message} onBlur={event => {
                      let numberVal = Number(event.target.value)
                      if (isNaN(numberVal)) {
                        numberVal = 2
                      }
                      field.onChange(numberVal.toFixed(2))
                    }}
                    value={field.value || ""} onInputChange={field.onChange} placeholder={t("subPrice")}
                    description={t("bundleSubPriceDescription")}
                  />
                )} name={"price"} control={form.control}
                />
              </section>
            </div>
          </form>
        </section>
      </DrawerContent>
    </Drawer>
  )
}

const EditPromotionalActivities = ({ items, updateItems, openState, setOpenState, initData }: {
  items: DiscountInfo[],
  updateItems: (items: DiscountInfo[]) => void,
  openState: boolean,
  setOpenState: (val: boolean) => void,
  initData?: DiscountInfo
}) => {

  const t = useTranslations("Profile.order")
  const commonTrans = useTranslations("Common")
  const addForm = useForm<DiscountInfo>({
    mode: "all",
    resolver: zodResolver(addDiscount),
    defaultValues: {}
  })

  const priceOptions: ISelectOption[] = useMemo(() => {
    return items.filter(item => item.discount_per === 0).map(item => {
      return {
        label: <div className={"text-left"}>
          ${item.price} {item.month_count}{t("monthUnit")}{t("month")} <span
            className={"text-[#bbb]"}
                                                                       >（{t("avg")}${calcAvg(Number(item.price), item.month_count)}/{t("month")}）</span></div>,
        value: item.id
      }
    })
  }, [items, t])

  useEffect(() => {
    if (openState) {
      if (initData) {
        addForm.reset(initData)
      } else {
        if (priceOptions.length) {
          addForm.setValue("id", priceOptions[0].value as number)
        }
      }
    }
  }, [openState, addForm, initData])
  const id = addForm.watch("id")
  const minTime = new Date()

  const disableShowText = useMemo(() => {
    const item = items.find(d => d.id === id)
    if (item) {
      return `${item.discount_price} ${item.month_count}${t("monthUnit")}${t("month")} （${t("avg")}${calcAvg(Number(item.discount_price), item.month_count)}/${t("month")}）`
    }
    return ""
  }, [id, items, t])

  return (
    <Drawer open={openState} onOpenChange={setOpenState}>
      <DrawerContent className={"h-[95vh] bg-white"}>
        <section className={"flex-1"}>
          <DrawerHeader className={"hidden"}>
            <DrawerTitle></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <form onSubmit={addForm.handleSubmit(data => {
            const newItems = items.map(item => {
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
              // @ts-expect-error
              if (item.id === data.id || (item.discount_id && item?.discount_id === data?.discount_id)) {
                return {
                  ...item,
                  ...data,
                  discount_per: Number(data.discount_per),
                  discount_price: Number((Number(item.price) * Number(data.discount_per) / 100).toFixed(2))
                }
              }
              return item
            })
            updateItems(newItems as DiscountInfo[])
            setOpenState(false)
            // updateSubscribeSettingItem({
            //   ...newValues,
            //   discount_per: Number(newValues.discount_per)
            // }).then((response) => {
            //   if (response) {
            //     showMessage("保存成功","default",{
            //       afterDuration: () => {
            //         setIsOpen(false)
            //       }
            //     })
            //   }
            // })
          })}
          >
            <ModalHeader title={t("discountActivities")}
              left={<button type={"button"} onTouchEnd={() => {
                setOpenState(false)
              }} className={"text-base text-[#777]"}
                    >{commonTrans("cancel")}</button>}
              right={(
                <button type={"submit"}
                  className={"text-text-theme text-base"}
                >{commonTrans("save")}</button>
              )}
            ></ModalHeader>

            <div className={"mt-5 block px-4"}>
              <section>
                <Controller render={({ field, fieldState }) => {
                  return (
                    initData ? (
                      <InputWithLabel
                        disabled
                        errorMessage={fieldState.error?.message}
                        description={t("discountBaseOnDescription")}
                        label={t("discountBaseOnLabel")}
                        value={disableShowText}
                      />
                    ) : (
                      <InputWithLabel
                        errorMessage={fieldState.error?.message}
                        description={t("discountBaseOnDescription")}
                        label={t("discountBaseOnLabel")}
                        value={field.value}
                        onInputChange={field.onChange}
                        options={priceOptions}
                      />
                    )
                  )
                }} name={"id"} control={addForm.control}
                />

              </section>
              <section className={"mt-[30px]"}>
                <Controller control={addForm.control} render={({ field, fieldState }) => {
                  return (
                    <InputWithLabel
                      errorMessage={fieldState.error?.message}
                      value={field.value || ""} label={t("discountPromotional")} max={90}
                      onInputChange={field.onChange}
                      onBlur={event => {
                        const value = event.target.value
                        if (value !== "" && value !== undefined && value !== null) {
                          let numberVal = parseInt(value)
                          if (isNaN(numberVal)) {
                            numberVal = 1
                          }
                          field.onChange(`${numberVal > 90 ? 90 : numberVal}`)
                        }
                      }}
                      description={t("discountPromotionalDescription")}
                    />
                  )
                }} name="discount_per"
                />
              </section>
              <section className={"mt-[30px]"}>
                <Controller render={({ field }) => {
                  // <InputWithLabel value={field.value} onInputChange={field.onChange} label={"促销开始时间"}/>
                  return (
                    <TopLabelWrapper label={t("discountStartTime")}>
                      <DateTimePicker min={minTime} disabled={!id} value={field.value * 1000} dateChange={value => {
                        field.onChange(value / 1000)
                      }}
                      >
                        <div
                          className={field.value ? "" : "text-gray-500"}
                        >{field.value ? dayjs(field.value * 1000).format(ZH_YYYY_MM_DD_HH_mm) : "请选择"}</div>
                      </DateTimePicker>
                    </TopLabelWrapper>
                  )
                }} name={"discount_start_time"} control={addForm.control}
                />
              </section>
              <section className={"mt-[30px]"}>
                <Controller render={({ field, fieldState }) => {
                  return (
                    <TopLabelWrapper label={t("discountEndTime")} errorMessage={fieldState.error?.message}>
                      <DateTimePicker min={minTime} disabled={!id} value={field.value * 1000} dateChange={value => {
                        field.onChange(value / 1000)
                      }}
                      >
                        <div
                          className={field.value ? "" : "text-gray-500"}
                        >{field.value ? dayjs(field.value * 1000).format(ZH_YYYY_MM_DD_HH_mm) : "请选择"}</div>
                      </DateTimePicker>
                    </TopLabelWrapper>
                  )
                }} name={"discount_end_time"} control={addForm.control}
                />
              </section>
            </div>
          </form>
        </section>
      </DrawerContent>
    </Drawer>
  )
}

function calcAvg(total: number, count: number) {
  if (total === 0 || count === 0) return 0
  return (total / count).toFixed(2)
}


function TopLabelWrapper({ label, children, errorMessage }: {
  children: React.ReactNode,
  label: React.ReactNode,
  errorMessage?: React.ReactNode
}) {
  return (
    <section className="relative mt-6 rounded-xl">
      <div className={"text-text-desc absolute -top-2.5 left-4 bg-white pl-1 pr-4"}>
        {label}
      </div>
      <section
        className={"flex h-[48px] items-center rounded-xl border border-[#ddd] px-4"}
      >
        {children}
      </section>
      {errorMessage && <div className="text-theme mt-1.5 px-4 text-xs">{errorMessage}</div>}
    </section>
  )
}

function SubscribeBundle({ items, userId, updateItems, basePrice }: {
  items: DiscountInfo[],
  userId: number,
  updateItems: (items: DiscountInfo[]) => void,
  basePrice: number
}) {
  const t = useTranslations("Profile.order")
  const commonTrans = useTranslations("Common")
  const bundleForm = useForm<{ list: DiscountInfo[] }>({
    mode: "all",
    defaultValues: {
      list: items
    }
  })
  const { fields, append, update } = useFieldArray({
    control: bundleForm.control,
    name: "list",
    keyName: "discount_id"
  })

  const mockSubmit = () => {
    bundleForm.trigger().then(() => {
      const values = bundleForm.getValues()
      updateItems(values.list)
    })
  }

  const [editModalOpenState, setEditModalOpenState] = useState<boolean>(false)
  const [editModalInitData, setEditModalEditInitData] = useState<DiscountInfo | undefined>()
  const openEditModal = (data?: DiscountInfo) => {
    setEditModalEditInitData(data)
    setEditModalOpenState(true)
  }

  const handleEditModalCallback = (data: DiscountInfo) => {
    if (data.id < 0) {
      append(data)
    } else {
      const updateIndex = fields.findIndex(item => item.id === data.id)
      const defaultItem = items.find(i => i.id === data.id)
      const shouldChangeStatus = defaultItem && Number(defaultItem.price) !== Number(data.price)
      update(updateIndex, {
        ...data,
        discount_status: shouldChangeStatus ? false : data.discount_status
      })
    }
    mockSubmit()
  }

  useEffect(() => {
    bundleForm.setValue("list", items)
  }, [items])

  return (
    <section className={"border-b border-gray-100 py-5"}>
      <EditSubscriptionModal
        setOpenState={setEditModalOpenState}
        openState={editModalOpenState}
        initData={editModalInitData}
        callback={handleEditModalCallback}
        userId={userId}
        currentDiscounts={fields}
        basePrice={basePrice}
      />
      <form>
        <section className="px-4">
          <section className="flex items-center justify-between">
            <h1 className="text-base font-medium">{t("bundleSub")}</h1>
            {fields.length < 5 && (
              <button
                onTouchEnd={() => {
                  openEditModal()
                }}
                className="border-border-theme text-text-theme rounded-full border px-4 py-0.5"
              >{commonTrans("add")}
              </button>
            )}
          </section>
          {fields.length === 0 && (
            <section className={"text-xs text-[#777]"}>
              {/*提供几个月的订阅作为折扣捆绑*/}
              {t("emptyBundle")}
            </section>
          )}
          {fields.map((discount, index) => (
            <Controller key={index} control={bundleForm.control} render={({ field }) => {
              return (
                <TopLabelWrapper label={`${t("price")}${index + 1}`}>
                  <section className={"flex w-full items-center justify-between"}>
                    <button type={"button"} onClick={() => {
                      openEditModal(discount)
                    }} className={"flex-1 text-left"}
                    >
                      ${discount.price}&nbsp;&nbsp;{discount.month_count}{t("monthUnit")}{t("month")}&nbsp;&nbsp;<span
                        className="text-gray-secondary"
                                                                                                                 >({t("avg")} ${calcAvg(discount.price, discount.month_count)}/{t("month")})</span>
                    </button>
                    <Switch className={"custom-switch"} checked={!field.value.item_status} onCheckedChange={(value) => {
                      field.onChange({
                        ...discount,
                        item_status: !value,
                        discount_status: !value ? true : discount.discount_status
                      })
                      mockSubmit()
                    }}
                    ></Switch>
                  </section>
                </TopLabelWrapper>
              )
            }} name={`list.${index}`}
            />
          ))}
        </section>
      </form>
    </section>
  )
}

function DiscountPercentLabel({ index, percent }: { index: number, percent: number }) {
  const t = useTranslations("Profile.order")
  return (
    <div className={"flex items-center gap-1"}>
      <div>{t("discount")}{index}</div>
      <div
        className={"relative bottom-1 rounded-t-full rounded-br-full bg-[#F7B500] px-1.5 py-0.5 text-xs text-white"}
      >{percent}%
        off
      </div>
    </div>
  )
}

function PromotionalActivities({ updateItems, items }: {
  items: DiscountInfo[]
  updateItems: (values: DiscountInfo[]) => void
}) {
  const t = useTranslations("Profile.order")
  const commonTrans = useTranslations("Common")
  const contentRef = useRef<HTMLElement>(null)
  const discountList = useMemo(() => {
    return items.filter(item => item.discount_per > 0)
  }, [items])
  const noDiscountList = useMemo(() => {
    return items.filter(item => item.discount_per === 0)
  }, [items])

  const [openState, setOpenState] = useState<boolean>(false)
  const [editData, setEditData] = useState<DiscountInfo>()
  const openEditModal = (data?: DiscountInfo) => {
    setEditData(data)
    setOpenState(true)
  }

  const { showMessage } = useCommonMessageContext()

  return (
    <section ref={contentRef} className={"border-b border-gray-100 py-5"}>
      <EditPromotionalActivities
        initData={editData}
        items={items}
        updateItems={data => {
          updateItems(data)
          setTimeout(() => {
            contentRef?.current?.scrollIntoView({ behavior: "smooth" })
          }, 100)
        }}
        openState={openState}
        setOpenState={setOpenState}
      />
      <section className="px-4">
        <section className="flex items-center justify-between">
          <h1 className="text-base font-medium">{t("discountActivities")}</h1>
          {noDiscountList.length > 0 && (
            <button onClick={() => {
                openEditModal()
              }}
              className="border-border-theme text-text-theme rounded-full border px-4 py-0.5"
            >{commonTrans("add")}
            </button>
          )}
        </section>
        {discountList.length === 0 && (
          <section className={"text-xs text-[#777]"}>
            {t("emptyDiscount")}
          </section>
        )}
        {items.filter(d => d.discount_per > 0).map((discount, index) => {
          return (
            <TopLabelWrapper key={discount.id}
              label={<DiscountPercentLabel index={index + 1} percent={discount.discount_per} />}
            >
              <div className={"flex-1"} onTouchEnd={() => {
                openEditModal(discount)
              }}
              >
                <div>
                  {discount.discount_price}&nbsp;&nbsp;{discount.month_count}{t("monthUnit")}{t("month")}&nbsp;&nbsp;
                  <span
                    className="text-gray-secondary"
                  >({t("avg")} ${calcAvg(Number(discount.discount_price), discount.month_count)}/{t("month")})</span>
                </div>
                <div className="text-gray-secondary">
                  {dayjs(discount.discount_start_time * 1000).format(ZH_YYYY_MM_DD_HH_mm)} {dayjs(discount.discount_end_time * 1000).format(ZH_YYYY_MM_DD_HH_mm)}
                </div>
              </div>
              <Switch disabled={discount.item_status} className={"custom-switch"}
                checked={!discount.discount_status} onCheckedChange={(value) => {
                  const updateIndex = items.findIndex(i => i.id === discount.id)
                  const arr = [...items]
                  const item = arr[updateIndex]
                  item.discount_status = !value
                  arr.splice(updateIndex, 1, item)
                  updateItems(arr)
                  if (value) {
                    showMessage(t("attentionSettings"))
                  }
                }}
              ></Switch>
            </TopLabelWrapper>
          )
        })}
      </section>
    </section>
  )
}

function BasePriceSettings({ valueChange, value }: { valueChange: (value: number) => void, value: number }) {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [drawerIsOpen, setDrawerIsOpen] = useState<boolean>(false)

  const customPriceForm = useForm<{ price: string }>({
    mode: "all",
    resolver: zodResolver(z.object({
      price: z.string({ message: "请输入" }).refine(d => Number(d) >= 1.99, "您输入的价格有误").refine(d => Number(d) < 10000, "您输入的价格有误")
    }))
  })
  const handleChange = (v: unknown) => {
    if (v === 0) {
      valueChange(v)
    }
    if (v === -1) {
      customPriceForm.setValue("price", value.toString())
      setDrawerIsOpen(true)
    }
  }

  const options: ISelectOption[] = [
    {
      label: "免费",
      value: 0
    },
    {
      label: "自定义",
      value: -1
    }
  ]

  const { formState } = customPriceForm

  return (
    <>
      <SheetSelect
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        onInputChange={handleChange} options={options}
      >
        <div className={"flex justify-end"}>
          <IconWithImage url={"/icons/profile/icon_arrow_down@3x.png"} width={24}
            height={24} color={"#bbb"}
          />
        </div>
      </SheetSelect>

      <Dialog open={drawerIsOpen} onOpenChange={setDrawerIsOpen}>
        <DialogContent className={"hide-modal-close border-none bg-transparent"}>
          <form onSubmit={customPriceForm.handleSubmit((data => {
            valueChange(Number(data.price))
            setDrawerIsOpen(false)
          }))}
          >
            <div className={"mx-auto w-[270px] rounded-xl bg-white"}>
              <div className="p-4">
                <div className="text-center text-xs">
                  自定义金额
                </div>
                <div className="mt-2.5">
                  <Controller control={customPriceForm.control} render={({ field }) => {
                    return (
                      <input type={"number"} onKeyUp={event => {
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        //@ts-expect-error
                        const targetValue = event.target.value.replace(/^(-)*(\d+)\.(\d\d).*$/, "$1$2.$3")
                        field.onChange(targetValue)
                      }} value={field.value} onChange={field.onChange} onBlur={(event) => {
                        // 两位小数
                        const targetValue = event.target.value
                        let targetValueNumber = Number(targetValue)
                        if (isNaN(targetValueNumber)) {
                          targetValueNumber = 1.99
                        }
                        field.onChange(`${targetValueNumber}`)
                      }} className="block w-full rounded-full bg-[#F8F8F8] px-3 py-2"
                      />
                    )
                  }} name={"price"}
                  />
                  {!formState.errors.price?.message && <div className={"text-text-desc"}>最小价格$1.99 USDT</div>}
                  {formState.errors.price?.message &&
                    <div className={"mt-1.5 px-1 text-xs text-red-600"}>{formState.errors.price.message}</div>}
                </div>
              </div>
              <div className="grid grid-cols-2 border-t border-[#ddd] text-base">
                <button onTouchEnd={() => {
                  setDrawerIsOpen(false)
                }} className={"border-r border-[#ddd] py-3.5"}
                >取消
                </button>
                <button type={"submit"} className={"text-text-theme py-3.5 font-medium"}>确定
                </button>
              </div>
            </div>
          </form>
          <DialogHeader className={"hidden"}>
            <DialogTitle />
            <DialogDescription />
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </>
  )
}


export default function Page() {
  const router = useRouter()
  const [userInfo, setUserInfo] = useState<UserProfile>()
  const [defaultSettings, setDefaultSettings] = useState<SubscribeSetting | null>()
  const { showMessage } = useCommonMessageContext()
  const t = useTranslations("Profile.order")
  const commonTrans = useTranslations("Common")
  const refreshDefaultSettings = () => {
    getSubscribeSetting().then(response => {
      if (response) {
        setDefaultSettings({
          ...response,
          items: response?.items || []
        })
      }
    })
  }

  useEffect(() => {
    refreshDefaultSettings()
    userProfile().then(data => {
      if (data) {
        setUserInfo(data?.data)
      }
    })
  }, [])

  const baseFeeForm = useForm<Pick<SubscribeSetting, "price" | "id" | "user_id" | "items">>({
    mode: "all",
    resolver: zodResolver(baseSubscribe),
    defaultValues: { price: (defaultSettings?.price || 0) as number, items: [] }
  })
  const baseFormValues = baseFeeForm.watch()

  useEffect(() => {
    if (defaultSettings) {
      baseFeeForm.reset(defaultSettings)
    }
  }, [baseFeeForm, defaultSettings])

  const updateItems = (items: DiscountInfo[]) => {
    baseFeeForm.setValue("items", items)
  }

  const closeAllItemsState = () => {
    const items = baseFeeForm.getValues().items
    updateItems(items.map(item => {
      return {
        ...item,
        item_status: true,
        discount_status: true
      }
    }))
  }

  const realPrice = baseFeeForm.watch("price")

  const showBaseValue = useMemo(() => {
    if (Number(realPrice) === 0) {
      return t("free")
    }
    return realPrice.toFixed(2)
  }, [realPrice, t])

  const { withLoading } = useLoadingHandler({
    onError: (message) => {
      showMessage(typeof message === "string" ? message : commonTrans("updateFail"))
    },
    onSuccess: (message) => {
      showMessage(typeof message === "string" ? message : commonTrans("updateSuccess"), "success", {
        afterDuration: () => {
          router.push("/profile")
        }
      })
    }
  })

  const updateSubscribeSettings = async () => {
    const { price, items } = baseFormValues
    await withLoading(async () => {
      await addSubscribeSetting({
        price,
        id: userInfo?.id
      })
      await Promise.all(items.map(item => {
        const params = item.id < 0 ? omit(item, "id") : item
        return updateSubscribeSettingItem(params)
      }))
      if (!userInfo?.blogger) {
        await userApplyBlogger().then((res) => {
          if (res && res.code === 0) {
            console.log("申请博主成功")
          } else {
            console.log("申请博主失败")
          }
        })
      }
      return "更新成功"
    })
  }

  return (
    <div>
      <Header title={t("title")} titleColor={"#000"}
        right={<button onTouchEnd={() => {
          baseFeeForm.trigger().then(async (valid) => {
            if (valid) {
              await updateSubscribeSettings()
            }
          })
        }} className="text-text-theme text-base"
               >{t("complete")}</button>}
      />
      <section className="mt-5 text-black">
        <section className="border-b border-gray-100 px-4 pb-5">
          <h1 className="text-base font-medium">{t("baseSub")}</h1>
          <form>
            <section className="mt-2.5">
              <Controller render={({ field }) => {
                return (
                  <section>
                    <section className={clsx(
                      "relative rounded-xl"
                    )}
                    >
                      <label
                        style={{
                          transition: "top .1s",
                          top: -7
                        }} className={clsx(
                          "text-gray-secondary absolute left-4 z-30 bg-white font-normal leading-none transition"
                        )}
                      >
                        {t("monthlyPrice")}
                      </label>
                      <section
                        className={
                          clsx("relative z-20 flex h-[46px] items-center rounded-xl border border-[rgb(221,221,221)] px-4 py-3"
                          )
                        }
                      >
                        <div>{showBaseValue}</div>
                        <div className="flex flex-1 items-center justify-end">
                          <BasePriceSettings valueChange={value => {
                            field.onChange(value)
                            if (Number(value) === 0) {
                              closeAllItemsState()
                            }
                          }} value={field.value}
                          />
                        </div>
                      </section>
                    </section>
                    <section className="text-gray-secondary mt-1.5 px-4 text-xs">
                      <div>{t("baseSubLimit")}</div>
                      <div>{t("shouldBe1")} <span
                        className="text-text-theme"
                                            >{commonTrans("potatoWallet")}</span>，{t("shouldBe2")}
                      </div>
                    </section>
                  </section>
                )
              }} name={"price"} control={baseFeeForm.control}
              />
            </section>
          </form>
        </section>
        {userInfo && realPrice > 0 && (
          <SubscribeBundle basePrice={realPrice} updateItems={updateItems} items={baseFormValues.items} userId={userInfo?.id} />
        )}
        {realPrice > 0 && <PromotionalActivities items={baseFormValues.items} updateItems={updateItems} />}
      </section>
    </div>
  )
}