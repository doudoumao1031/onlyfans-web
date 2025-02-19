"use client"
import InputWithLabel from "@/components/profile/input-with-label"
import React, { useEffect, useMemo, useState } from "react"
import Header from "@/components/common/header"
import { useRouter } from "next/navigation"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle
} from "@/components/ui/drawer"
import ModalHeader from "@/components/common/modal-header"
import SheetSelect, { ISelectOption } from "@/components/common/sheet-select"
import {
  AddBundleDiscount,
  addSubscribeSetting,
  DiscountInfo,
  getSubscribeSetting,
  SubscribeSetting, updateSubscribeSettingItem, userApplyBlogger
} from "@/lib"
import { Switch } from "@/components/ui/switch"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addDiscount, baseSubscribe, bundlePriceSchema, bundleSubscribe } from "@/lib/actions/users/schemas"
import useCommonMessage from "@/components/common/common-message"
import dayjs from "dayjs"
import DateTimePicker from "@/components/common/date-time-picker"
import { UserProfile, userProfile } from "@/lib/actions/profile"
import clsx from "clsx"
import IconWithImage from "@/components/profile/icon"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog"
import { z } from "zod"
import { omit } from "lodash"

const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm"

const EditSubscriptionModal = ({ callback, userId, currentDiscounts, initData, openState, setOpenState }: {
  callback: (data: DiscountInfo) => void,
  userId: number,
  currentDiscounts: AddBundleDiscount[],
  initData?: DiscountInfo,
  openState: boolean,
  setOpenState: (val: boolean) => void
}) => {
  const { renderNode } = useCommonMessage()

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

  useEffect(() => {
    if (openState) {
      form.reset(initData)
    }
  }, [openState, form])

  const monthSelections = useMemo(() => {
    return [
      { label: "2个月", value: "2" },
      { label: "3个月", value: "3" },
      { label: "6个月", value: "6" },
      { label: "6个月", value: "9" },
      { label: "12个月", value: "12" }
    ].filter(item => !hasSub.includes(Number(item.value)))
  }, [hasSub])


  return (
    <Drawer open={openState} onOpenChange={setOpenState}>
      <DrawerContent className={"h-[95vh] bg-white"}>
        {renderNode}
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
            <ModalHeader title={"捆绑订阅"}
              left={<button type={"button"} onTouchEnd={() => {
                setOpenState(false)
              }} className={"text-base text-[#777]"}
              >取消</button>}
              right={(
                <button type={"submit"}
                  className={"text-base text-text-pink"}
                >保存</button>
              )}
            ></ModalHeader>

            <div className={"mt-5 block px-4"}>
              <Controller render={({ field, fieldState }) => {
                return (
                  initData ? (
                    <InputWithLabel placeholder={"订阅时限"} value={`${field.value}个月`} disabled/>
                  ) : (
                    <InputWithLabel errorMessage={fieldState.error?.message} placeholder={"订阅时限"}
                      onInputChange={field.onChange}
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
                      field.onChange(Number(event.target.value).toFixed(2))
                    }}
                    value={field.value} onInputChange={field.onChange} placeholder={"订阅价格"}
                    description={"最小价格$1.99 USDT，最高价格不超过999.99 价格保留小数点2位数"}
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

const EditPromotionalActivities = ({ items, updateItems, openState,setOpenState, initData }: {
  items: DiscountInfo[],
  updateItems: (items: DiscountInfo[]) => void,
  openState: boolean,
  setOpenState: (val: boolean) => void,
  initData?: DiscountInfo
}) => {
  const addForm = useForm<DiscountInfo>({
    mode: "all",
    resolver: zodResolver(addDiscount),
    defaultValues: {}
  })

  const priceOptions: ISelectOption[] = useMemo(() => {
    return items.filter(item => item.discount_per === 0).map(item => {
      return {
        label: <div className={"text-left"}>${item.discount_price} {item.month_count}个月 <span
          className={"text-[#bbb]"}
        >（平均约${calcAvg(Number(item.discount_price), item.month_count)}/月）</span></div>,
        value: item.id
      }
    })
  }, [items])



  useEffect(() => {
    if (openState) {
      addForm.reset(initData)
    }
  }, [openState, addForm, initData])
  const id = addForm.watch("id")
  const minTime = new Date()

  const disableShowText = useMemo(() => {
    const item = items.find(d => d.id === id)
    if (item) {
      return `${item.discount_price} ${item.month_count}个月 （平均约${calcAvg(Number(item.discount_price), item.month_count)}/月）`
    }
    return ""
  },[id, items])

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
                  discount_per: Number(data.discount_per)
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
            <ModalHeader title={"促销活动"}
              left={<button onTouchEnd={() => {
                setOpenState(false)
              }} className={"text-base text-[#777]"}
              >取消</button>}
              right={(
                <button type={"submit"}
                  className={"text-base text-text-pink"}
                >保存</button>
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
                        description={"在基本订阅和捆绑订阅中已经设定好的价格"}
                        label={"促销价格选择"}
                        value={disableShowText}
                      />
                    ) : (
                      <InputWithLabel
                        errorMessage={fieldState.error?.message}
                        description={"在基本订阅和捆绑订阅中已经设定好的价格"}
                        label={"促销价格选择"}
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
                      disabled={!id}
                      errorMessage={fieldState.error?.message}
                      value={field.value || ""} label={"促销折扣"} max={90}
                      onInputChange={field.onChange}
                      onBlur={event => {
                        const value = event.target.value
                        if (value !== "" && value !== undefined && value !== null) {
                          const numberVal = parseInt(value)
                          field.onChange(`${numberVal > 90 ? 90 : numberVal}`)
                        }
                      }}
                      description={"百分比，最高不超过90%"}
                    />
                  )
                }} name="discount_per"
                />
              </section>
              <section className={"mt-[30px]"}>
                <Controller render={({ field }) => {
                  // <InputWithLabel value={field.value} onInputChange={field.onChange} label={"促销开始时间"}/>
                  return (
                    <TopLabelWrapper label="促销开始时间">
                      <DateTimePicker min={minTime} disabled={!id} value={field.value * 1000} dateChange={value => {
                        field.onChange(value / 1000)
                      }}
                      >
                        <div
                          className={field.value ? "" : "text-gray-500"}
                        >{field.value ? dayjs(field.value * 1000).format(DATE_TIME_FORMAT) : "请选择"}</div>
                      </DateTimePicker>
                    </TopLabelWrapper>
                  )
                }} name={"discount_start_time"} control={addForm.control}
                />
              </section>
              <section className={"mt-[30px]"}>
                <Controller render={({ field, fieldState }) => {
                  return (
                    <TopLabelWrapper label="促销结束时间" errorMessage={fieldState.error?.message}>
                      <DateTimePicker min={minTime} disabled={!id} value={field.value * 1000} dateChange={value => {
                        field.onChange(value / 1000)
                      }}
                      >
                        <div
                          className={field.value ? "" : "text-gray-500"}
                        >{field.value ? dayjs(field.value * 1000).format(DATE_TIME_FORMAT) : "请选择"}</div>
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
    <section className="mt-6 relative rounded-xl">
      <div className={"absolute top-[-10px] left-4 bg-white text-[#6D7781]"}>
        {label}
      </div>
      <section
        className={"flex items-center pt-[12px] pb-[12px] pl-4 pr-4 rounded-xl border border-[rgb(221,221,221)]"}
      >
        {children}
      </section>
      {errorMessage && <div className="text-red-600 text-xs px-4 mt-1.5">{errorMessage}</div>}
    </section>
  )
}

function SubscribeBundle({ items,initSettings, userId, updateItems }: {
  items: DiscountInfo[],
  initSettings: DiscountInfo[]
  userId: number,
  updateItems: (items: DiscountInfo[]) => void
}) {
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
      const defaultItem = initSettings.find(i => i.id === data.id)
      const shouldChangeStatus = defaultItem && Number(defaultItem.price) !== Number(data.price)
      update(updateIndex, {
        ...data,
        discount_status: shouldChangeStatus? false :data.discount_status
      })
    }
    mockSubmit()
  }

  useEffect(() => {
    bundleForm.setValue("list", initSettings)
  }, [bundleForm, initSettings])

  return (
    <section className={"pt-5 pb-5 border-b border-gray-100"}>
      <EditSubscriptionModal
        setOpenState={setEditModalOpenState}
        openState={editModalOpenState}
        initData={editModalInitData}
        callback={handleEditModalCallback}
        userId={userId}
        currentDiscounts={fields}
      />
      <form>
        <section className="pl-4 pr-4">
          <section className="flex justify-between items-center">
            <h1 className="text-base font-medium">捆绑订阅</h1>
            {fields.length < 5 && (
              <button
                onTouchEnd={() => {
                  openEditModal()
                }}
                className="rounded-full border border-border-pink text-text-pink pl-4 pr-4 pt-0.5 pb-0.5"
              >添加
              </button>
            )}
          </section>
          {fields.length === 0 && (
            <section className={"text-xs text-[#777]"}>
              提供几个月的订阅作为折扣捆绑
            </section>
          )}
          {fields.map((discount, index) => (
            <Controller key={index} control={bundleForm.control} render={({ field }) => {
              return (
                <TopLabelWrapper label={`价格${index + 1}`}>
                  <section className={"flex items-center justify-between w-full"}>
                    <button type={"button"} onTouchEnd={() => {
                      openEditModal(discount)
                    }} className={"flex-1 text-left"}
                    >
                      ${discount.price}&nbsp;&nbsp;{discount.month_count}个月&nbsp;&nbsp;<span
                        className="text-[#6D7781]"
                      >(平均${calcAvg(discount.price, discount.month_count)}/月)</span>
                    </button>
                    <Switch className={"custom-switch"} checked={field.value.item_status} onCheckedChange={(value) => {
                      field.onChange({
                        ...field.value,
                        item_status: value,
                        discount_status: !value ? false : field.value.discount_status
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

function DiscountPercentLabel ({ index,percent }:{index:number,percent:number}) {
  return (
    <div className={"flex gap-1 items-center"}>
      <div>促销{index}</div>
      <div className={"rounded-tl-full rounded-tr-full rounded-br-full bg-[#F7B500] text-white px-1.5 py-0.5 text-xs"}>{percent}% off</div>
    </div>
  )
}

function PromotionalActivities({ updateItems, items }: {
  items: DiscountInfo[]
  updateItems: (values: DiscountInfo[]) => void
}) {
  const discountList = useMemo(() => {
    return items.filter(item => item.discount_per > 0)
  },[items])
  const noDiscountList = useMemo(() => {
    return items.filter(item => item.discount_per === 0)
  },[items])

  const [openState,setOpenState] = useState<boolean>(false)
  const [editData,setEditData] = useState<DiscountInfo>()
  const openEditModal = (data?: DiscountInfo) => {
    setEditData(data)
    setOpenState(true)
  }

  return (
    <section className={"pt-5 pb-5 border-b border-gray-100"}>
      <EditPromotionalActivities initData={editData} items={items} updateItems={updateItems} openState={openState} setOpenState={setOpenState}/>
      <section className="pl-4 pr-4">
        <section className="flex justify-between items-center">
          <h1 className="text-base font-medium">促销活动</h1>
          {noDiscountList.length > 0 && (
            <button
              onTouchEnd={() => {
                openEditModal()
              }}
              className="rounded-full border border-border-pink text-text-pink pl-4 pr-4 pt-0.5 pb-0.5"
            >添加
            </button>
          )}
        </section>
        {discountList.length === 0 && (
          <section className={"text-xs text-[#777]"}>
            为用户提供订阅的促销活动，可以为您吸引更多的订阅用户
          </section>
        )}
        {items.filter(d => d.discount_per > 0).map((discount, index) => {
          return (
            <TopLabelWrapper key={discount.id} label={<DiscountPercentLabel index={index+1} percent={discount.discount_per}/>}>
              <div className={"flex-1"} onTouchEnd={() => {
                openEditModal(discount)
              }}
              >
                <div>
                  {discount.discount_price}&nbsp;&nbsp;{discount.month_count}个月&nbsp;&nbsp;<span
                    className="text-[#6D7781]"
                  >(平均${calcAvg(Number(discount.discount_price), discount.month_count)}/月)</span>
                </div>
                <div className="text-[#6D7781]">
                  {dayjs(discount.discount_start_time * 1000).format(DATE_TIME_FORMAT)} {dayjs(discount.discount_end_time * 1000).format(DATE_TIME_FORMAT)}
                </div>
              </div>
              <Switch disabled={!discount.item_status} className={"custom-switch"}
                checked={discount.discount_status} onCheckedChange={(value) => {
                  const updateIndex = items.findIndex(i => i.id === discount.id)
                  const arr = [...items]
                  const item = arr[updateIndex]
                  item.discount_status = value
                  arr.splice(updateIndex,1,item)
                  updateItems(arr)
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
      price: bundlePriceSchema
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
        <IconWithImage url={"/icons/profile/icon_arrow_down@3x.png"} width={24}
          height={24} color={"#bbb"}
        />
      </SheetSelect>

      <Dialog open={drawerIsOpen} onOpenChange={setDrawerIsOpen}>
        <DialogContent className={"hide-modal-close border-none bg-transparent"}>
          <form onSubmit={customPriceForm.handleSubmit((data => {
            valueChange(Number(data.price))
            setDrawerIsOpen(false)
          }))}
          >
            <div className={"bg-white rounded-xl w-[270px] ml-auto mr-auto"}>
              <div className="py-4 px-4">
                <div className="text-center text-xs">
                  自定义金额
                </div>
                <div className="mt-2.5">
                  <Controller control={customPriceForm.control} render={({ field }) => {
                    return (
                      <input value={field.value} onChange={field.onChange} onBlur={(event) => {
                        const targetValue = event.target.value
                        if (value) {
                          field.onChange(Number(targetValue).toFixed(2).toString())
                        }
                      }} className="w-full block bg-[#F8F8F8] rounded-full px-5 py-2"
                      />
                    )
                  }} name={"price"}
                  />
                  {formState.errors.price?.message &&
                    <div className={"text-xs text-red-600 mt-1.5 px-1"}>{formState.errors.price.message}</div>}
                </div>
              </div>
              <div className="grid grid-cols-2 text-base border-t border-[#ddd]">
                <button onTouchEnd={() => {
                  setDrawerIsOpen(false)
                }} className={"py-3.5 border-r border-[#ddd]"}
                >取消
                </button>
                <button type={"submit"} className={"py-3.5 text-text-pink font-medium"}>确定
                </button>
              </div>
            </div>
          </form>
          <DialogHeader className={"hidden"}>
            <DialogTitle/>
            <DialogDescription/>
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
  const { showMessage, renderNode } = useCommonMessage()
  const refreshDefaultSettings = () => {
    getSubscribeSetting().then(response => {
      if (response) {
        console.log(response.items)
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

  const realPrice = baseFeeForm.watch("price")

  const showBaseValue = useMemo(() => {
    if (Number(realPrice) === 0) {
      return "免费"
    }
    return realPrice.toFixed(2)
  }, [realPrice])

  const updateSubscribeSettings = async () => {
    const { price, items } = baseFormValues
    try {
      await addSubscribeSetting({
        price,
        id: userInfo?.id
      })
      await Promise.all(items.map(item => {
        const params = item.id < 0 ? omit(item, "id") : item
        return updateSubscribeSettingItem(params)
      }))
      userApplyBlogger().then((res) => {
        if (res && res.code === 0) {
          console.log("申请博主成功")
        } else {
          console.log("申请博主失败")
        }
      })
      showMessage("更新成功", "", {
        afterDuration: router.back
      })
    } catch (e) {
      showMessage("更新失败")
    }
  }

  return (
    <div>
      {renderNode}
      <Header title={"订阅管理"} titleColor={"#000"}
        right={<button onTouchEnd={() => {
          baseFeeForm.trigger().then(valid => {
            if (valid) {
              updateSubscribeSettings()
            }
          })
        }} className="text-text-pink text-base"
        >完成</button>}
      />
      <section className="mt-5 text-black">
        <section className="pl-4 pr-4 pb-5 border-b border-gray-100">
          <h1 className="text-base font-medium">基本订阅</h1>
          <form>
            <section className="mt-2.5">
              <Controller render={({ field }) => {
                return (
                  <section>
                    <section className={clsx(
                      "relative rounded-xl",
                    )}
                    >
                      <label
                        style={{
                          transition: "top .1s",
                          top: -7
                        }} className={clsx(
                          "absolute bg-white left-4 leading-none font-normal z-30 transition text-[#6D7781]",
                        )}
                      >
                        每月价格
                      </label>
                      <section
                        className={
                          clsx("h-[46px] flex pt-[12px] pb-[12px] pl-4 pr-4 rounded-xl border border-[rgb(221,221,221)] relative z-20 items-center justify-between",
                          )
                        }
                      >
                        <div>{showBaseValue}</div>
                        <div className="shrink-0 flex items-center">
                          <BasePriceSettings valueChange={field.onChange} value={field.value}/>
                        </div>
                      </section>
                    </section>
                    <section className="text-[#6D7781] text-xs px-4 mt-1.5">
                      <div>最小价格$1.99 USDT 或免费</div>
                      <div>您必须先开通 <span className="text-text-pink">Potato钱包</span>，然后才能设置订阅价格或收取打赏
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
          <SubscribeBundle updateItems={updateItems} items={baseFormValues.items} initSettings={baseFormValues?.items ?? []}
            userId={userInfo?.id}
          />
        )}
        {realPrice > 0 && <PromotionalActivities items={baseFormValues.items} updateItems={updateItems}/>}
      </section>
    </div>
  )
}