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
  DrawerTitle,
  DrawerTrigger
} from "@/components/ui/drawer"
import ModalHeader from "@/components/common/modal-header"
import SheetSelect, { ISelectOption } from "@/components/common/sheet-select"
import {
  AddBundleDiscount,
  addSubscribeSetting,
  addSubscribeSettingItem, DiscountInfo,
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

const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm"

const AddSubscriptionModal = ({ children, refresh ,userId }: { children: React.ReactNode, refresh: () => void ,userId: number}) => {
  const { showMessage, renderNode } = useCommonMessage()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const handleClose = () => setIsOpen(false)

  const form = useForm<AddBundleDiscount>({
    mode: "all",
    resolver: zodResolver(bundleSubscribe),
    defaultValues: {}
  })

  useEffect(() => {
    if (isOpen) {
      form.reset()
    }
  }, [isOpen, form])


  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className={"h-[95vh] bg-white"}>
        {renderNode}
        <section className={"flex-1"}>
          <DrawerHeader className={"hidden"}>
            <DrawerTitle></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <form onSubmit={form.handleSubmit(data => {
            addSubscribeSettingItem({
              ...data,
              price: Number(data.price),
              month_count: Number(data.month_count),
              user_id: userId
            }).then((result) => {
              if (result?.code === 0) {
                showMessage("添加成功", "default", {
                  afterDuration: () => {
                    setIsOpen(false)
                  }
                })
                refresh()
              }
              if (result?.code === 400) {
                if (result?.message === "SUBSCRIBE_ITEM_SAME_MONTH_ERR") {
                  form.setError("month_count", {
                    type: "custom",
                    message: "月份订阅设置重复"
                  })
                }
              }
            })
          })}
          >
            <ModalHeader title={"捆绑订阅"}
              left={<button type={"button"} onTouchEnd={handleClose}
                className={"text-base text-[#777]"}
              >取消</button>}
              right={(
                <button type={"submit"}
                  className={"text-base text-main-pink"}
                >保存</button>
              )}
            ></ModalHeader>

            <div className={"mt-5 block px-4"}>
              <Controller render={({ field, fieldState }) => {
                return (
                  <InputWithLabel errorMessage={fieldState.error?.message} placeholder={"订阅时限"}
                    onInputChange={field.onChange}
                    options={[
                      { label: "1个月", value: "1" },
                      { label: "2个月", value: "2" },
                      { label: "3个月", value: "3" },
                      { label: "4个月", value: "4" }
                    ]}
                    value={field.value}
                  />
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

const AddPromotionalActivities = ({ children, unsubList }: { children: React.ReactNode, unsubList: DiscountInfo[] }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const handleClose = () => setIsOpen(false)
  const addForm = useForm<DiscountInfo>({
    mode: "all",
    resolver: zodResolver(addDiscount),
    defaultValues: {}
  })

  const priceOptions: ISelectOption[] = useMemo(() => {
    return unsubList.map(item => {
      return {
        label: <div className={"text-left"}>${item.discount_price} {item.month_count}个月 <span
          className={"text-[#bbb]"}
        >（平均约${calcAvg(item.discount_price, item.month_count)}/月）</span></div>,
        value: item.id
      }
    })
  }, [unsubList])

  useEffect(() => {
    if (isOpen) {
      addForm.reset()
    }
  }, [isOpen, addForm])

  const id = addForm.watch("id")

  const { showMessage,renderNode } = useCommonMessage()
  const minTime = new Date()

  return (
    <Drawer open={isOpen} onOpenChange={setIsOpen}>
      {renderNode}
      <DrawerTrigger asChild>
        {children}
      </DrawerTrigger>
      <DrawerContent className={"h-[95vh] bg-white"}>
        <section className={"flex-1"}>
          <DrawerHeader className={"hidden"}>
            <DrawerTitle></DrawerTitle>
            <DrawerDescription></DrawerDescription>
          </DrawerHeader>
          <form onSubmit={addForm.handleSubmit(data => {
            const old = unsubList.find(item => item.id === data.id)
            const newValues = {
              ...old,
              ...data
            }
            updateSubscribeSettingItem({
              ...newValues,
              discount_per: Number(newValues.discount_per)
            }).then((response) => {
              if (response) {
                showMessage("保存成功","default",{
                  afterDuration: () => {
                    setIsOpen(false)
                  }
                })
              }
            })
          })}
          >
            <ModalHeader title={"促销活动"}
              left={<button onTouchEnd={handleClose} className={"text-base text-[#777]"}>取消</button>}
              right={(
                <button type={"submit"}
                  className={"text-base text-main-pink"}
                >保存</button>
              )}
            ></ModalHeader>

            <div className={"mt-5 block px-4"}>
              <section>
                <Controller render={({ field, fieldState }) => {
                  return (
                    <InputWithLabel
                      errorMessage={fieldState.error?.message}
                      description={"在基本订阅和捆绑订阅中已经设定好的价格"}
                      label={"促销价格选择"}
                      value={field.value}
                      onInputChange={field.onChange}
                      options={priceOptions}
                    />
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
                        <div className={field.value ? "" : "text-gray-500"}>{field.value ? dayjs(field.value * 1000).format(DATE_TIME_FORMAT) : "请选择"}</div>
                      </DateTimePicker>
                    </TopLabelWrapper>
                  )
                }} name={"discount_start_time"} control={addForm.control}
                />
              </section>
              <section className={"mt-[30px]"}>
                <Controller render={({ field,fieldState }) => {
                  return (
                    <TopLabelWrapper label="促销结束时间" errorMessage={fieldState.error?.message}>
                      <DateTimePicker min={minTime} disabled={!id} value={field.value * 1000} dateChange={value => {
                        field.onChange(value / 1000)
                      }}
                      >
                        <div className={field.value ? "" : "text-gray-500"}>{field.value ? dayjs(field.value * 1000).format(DATE_TIME_FORMAT) : "请选择"}</div>
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

function SubscribeBundle({ refresh, initSettings ,userId }: {
  refresh: () => void,
  initSettings: DiscountInfo[]
  userId: number
}) {
  const bundleForm = useForm<{ list: DiscountInfo[] }>({
    mode: "all",
    defaultValues:{
      list: initSettings
    }
  })
  // bundleForm.setValue("list", initSettings)
  const { fields } = useFieldArray({
    control: bundleForm.control,
    name: "list"
  })
  return (
    <section className={"pt-5 pb-5 border-b border-gray-100"}>
      <form>
        <section className="pl-4 pr-4">
          <section className="flex justify-between items-center">
            <h1 className="text-base font-medium">捆绑订阅</h1>
            {fields.length < 6 && (
              <AddSubscriptionModal refresh={refresh} userId={userId}>
                <button
                  className="rounded-full border border-main-pink text-main-pink pl-4 pr-4 pt-0.5 pb-0.5"
                >添加
                </button>
              </AddSubscriptionModal>
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
                    <section className={"flex-1"}>
                      ${discount.price}&nbsp;&nbsp;{discount.month_count}个月&nbsp;&nbsp;<span
                        className="text-[#6D7781]"
                      >(平均${calcAvg(discount.price, discount.month_count)}/月)</span>
                    </section>
                    <Switch className={"custom-switch"} checked={field.value.item_status} onCheckedChange={(value) => {
                      field.onChange({
                        ...field.value,
                        item_status: value
                      })
                      updateSubscribeSettingItem({
                        ...field.value,
                        item_status: value
                      }).then(refresh)
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

function PromotionalActivities({ initDiscountList, unsubList,refresh }: {
  initDiscountList: DiscountInfo[],
  unsubList: DiscountInfo[],
  refresh: () => void
}) {
  const form = useForm<{ list: DiscountInfo[] }>({
    mode: "all"
  })
  useEffect(() => {
    form.setValue("list", initDiscountList)
  }, [initDiscountList, form])

  const { fields: discountList } = useFieldArray({
    name: "list",
    control: form.control
  })
  return (
    <section className={"pt-5 pb-5 border-b border-gray-100"}>
      <section className="pl-4 pr-4">
        <section className="flex justify-between items-center">
          <h1 className="text-base font-medium">促销活动</h1>
          {unsubList.length > 0 && (
            <AddPromotionalActivities unsubList={unsubList}>
              <button
                className="rounded-full border border-main-pink text-main-pink pl-4 pr-4 pt-0.5 pb-0.5"
              >添加
              </button>
            </AddPromotionalActivities>
          )}
        </section>
        {discountList.length === 0 && (
          <section className={"text-xs text-[#777]"}>
            为用户提供订阅的促销活动，可以为您吸引更多的订阅用户
          </section>
        )}
        {discountList.map((discount, index) => (
          <Controller key={discount.id} control={form.control} render={({ field }) => {
            return (
              <TopLabelWrapper label={`促销${index + 1}`}>
                <div className={"flex-1"}>
                  <div>
                    {discount.discount_price}&nbsp;&nbsp;{discount.month_count}个月&nbsp;&nbsp;<span
                      className="text-[#6D7781]"
                    >(平均${calcAvg(discount.discount_price, discount.month_count)}/月)</span>
                  </div>
                  <div className="text-[#6D7781]">
                    {dayjs(discount.discount_start_time * 1000).format(DATE_TIME_FORMAT)} {dayjs(discount.discount_end_time * 1000).format(DATE_TIME_FORMAT)}
                  </div>
                </div>
                <Switch className={"custom-switch"} checked={field.value.discount_status} onCheckedChange={(value) => {
                  field.onChange({
                    ...field.value,
                    discount_status: value
                  })
                  updateSubscribeSettingItem({
                    ...field.value,
                    discount_status: value
                  }).then(refresh)
                }}
                ></Switch>
              </TopLabelWrapper>
            )
          }} name={`list.${index}`}
          />
        ))}
      </section>
    </section>
  )
}

function BasePriceSettings ({ valueChange,value }:{valueChange: (value: number) => void , value: number}) {
  const [isOpen,setIsOpen] = useState<boolean>(false)
  const [drawerIsOpen,setDrawerIsOpen] = useState<boolean>(false)

  const customPriceForm = useForm<{price: string}>({
    mode:"all",
    resolver: zodResolver(z.object({
      price: bundlePriceSchema
    }))
  })
  const handleChange = (v:unknown) => {
    if (v === 0) {
      valueChange(v)
    }
    if (v === -1) {
      customPriceForm.setValue("price",value.toString())
      setDrawerIsOpen(true)
    }
  }

  const options:ISelectOption[] = [
    {
      label:"免费",
      value: 0
    },
    {
      label:"自定义",
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
                  {formState.errors.price?.message && <div className={"text-xs text-red-600 mt-1.5 px-1"}>{formState.errors.price.message}</div>}
                </div>
              </div>
              <div className="grid grid-cols-2 text-base border-t border-[#ddd]">
                <button onTouchEnd={() => {
                  setDrawerIsOpen(false)
                }} className={"py-3.5 border-r border-[#ddd]"}
                >取消
                </button>
                <button type={"submit"}  className={"py-3.5 text-main-pink font-medium"}>确定
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
  const [userInfo,setUserInfo] = useState<UserProfile>()
  const [defaultSettings, setDefaultSettings] = useState<SubscribeSetting | null>()
  const { showMessage, renderNode } = useCommonMessage()
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
      if (data ) {
        setUserInfo(data?.data)
      }
    })
  }, [])

  const discountConfig = useMemo(() => {
    if (defaultSettings) {
      return {
        initList: defaultSettings.items.filter(item => item.discount_per > 0), // 已有促销
        unsubList: defaultSettings.items.filter(item => item.discount_per === 0) // 未促销
      }
    }
    return {
      initList: [],
      unsubList: []
    }
  }, [defaultSettings])

  const baseFeeForm = useForm<Pick<SubscribeSetting, "price" | "id" | "user_id">>({
    mode: "all",
    resolver: zodResolver(baseSubscribe),
    defaultValues: { price: (defaultSettings?.price || 0) as number }
  })
  const baseFormValues = baseFeeForm.watch()

  useEffect(() => {
    const { price } = defaultSettings || {}
    if (price !== undefined) {
      baseFeeForm.setValue("price", price)
    }
  }, [baseFeeForm, defaultSettings])

  const realPrice = baseFeeForm.watch("price")

  const showBaseValue = useMemo(() => {
    if (Number(realPrice) === 0) {
      return "免费"
    }
    return realPrice.toFixed(2)
  },[realPrice])

  return (
    <div>
      {renderNode}
      <Header title={"订阅管理"} titleColor={"#000"}
        right={<button onTouchEnd={() => {
          baseFeeForm.trigger().then(valid => {
            if (valid) {
              addSubscribeSetting({
                price: Number(baseFormValues.price),
                id: userInfo?.id
              }).then(data => {
                if (data) {
                  showMessage("修改成功", "default", {
                    afterDuration: router.back
                  })
                }
                // todo: 根据profile信息判断是否已经是博主，是则不调用
                userApplyBlogger().then((res) => {
                  if (res && res.code === 0) {
                    console.log("申请博主成功")
                  } else {
                    console.log("申请博主失败")
                  }
                })
              })
            }
          })
        }} className="text-main-pink text-base"
        >完成</button>}
      />
      <section className="mt-5 text-black">
        <section className="pl-4 pr-4 pb-5 border-b border-gray-100">
          <h1 className="text-base font-medium">基本订阅</h1>
          <form>
            <section className="mt-2.5">

              <Controller render={({ field, fieldState }) => {
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
                        <div >{showBaseValue}</div>
                        <div className="shrink-0 flex items-center">
                          <BasePriceSettings valueChange={field.onChange} value={field.value}/>
                        </div>
                      </section>
                    </section>
                    <section className="text-[#6D7781] text-xs px-4 mt-1.5">
                      <div>最小价格$1.99 USDT 或免费</div>
                      <div>您必须先开通 <span className="text-main-pink">Potato钱包</span>，然后才能设置订阅价格或收取打赏</div>
                    </section>
                  </section>
                  // <InputWithLabel
                  //   errorMessage={fieldState.error?.message}
                  //   onInputChange={field.onChange}
                  //   onBlur={event => {
                  //     field.onChange(Number(event.target.value).toFixed(2))
                  //   }}
                  //   value={field.value} label={"每月价格"} description={(
                  //     <>
                  //       <div>最小价格$1.99 USDT 或免费</div>
                  //       您必须先开通 <span className="text-main-pink">Potato钱包</span>，然后才能设置订阅价格或收取打赏
                  //     </>
                  //   )}
                  // />
                )
              }} name={"price"} control={baseFeeForm.control}
              />
            </section>
          </form>
        </section>
        {userInfo && defaultSettings?.items && <SubscribeBundle initSettings={discountConfig.initList} refresh={refreshDefaultSettings} userId={userInfo?.id}/>}
        <PromotionalActivities initDiscountList={discountConfig.initList} unsubList={discountConfig.unsubList} refresh={refreshDefaultSettings}/>
      </section>
    </div>
  )
}