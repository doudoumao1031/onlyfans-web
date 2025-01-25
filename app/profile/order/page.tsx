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
import { ISelectOption } from "@/components/common/sheet-select"
import {
  AddBundleDiscount,
  addSubscribeSetting,
  addSubscribeSettingItem, DiscountInfo,
  getSubscribeSetting,
  SubscribeSetting, updateSubscribeSettingItem
} from "@/lib"
import { Switch } from "@/components/ui/switch"
import { Controller, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { addDiscount, baseSubscribe, bundleSubscribe } from "@/lib/actions/users/schemas"
import useCommonMessage from "@/components/common/common-message"
import dayjs from "dayjs"
import DateTimePicker from "@/components/common/date-time-picker"

const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm"

const AddSubscriptionModal = ({ children, refresh }: { children: React.ReactNode, refresh: () => void }) => {
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
              user_id: 1
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
                      value={field.value} label={"促销折扣"} max={90}
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

function SubscribeBundle({ refresh, initSettings }: {
  refresh: () => void,
  initSettings: DiscountInfo[]
}) {
  const bundleForm = useForm<{ list: DiscountInfo[] }>({
    mode: "onChange"
  })
  useEffect(() => {
    bundleForm.setValue("list", initSettings)
  }, [bundleForm, initSettings])
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
              <AddSubscriptionModal refresh={refresh}>
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
                    <Switch checked={field.value.item_status} onCheckedChange={(value) => {
                      field.onChange({
                        ...field.value,
                        item_status: value
                      })
                      updateSubscribeSettingItem(field.value).then(refresh)
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

function PromotionalActivities({ initDiscountList, unsubList }: {
  initDiscountList: DiscountInfo[],
  unsubList: DiscountInfo[]
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
                <Switch checked={field.value.discount_status}></Switch>
              </TopLabelWrapper>
            )
          }} name={`list.${index}`}
          />
        ))}
      </section>
    </section>
  )
}


export default function Page() {
  const router = useRouter()
  const [defaultSettings, setDefaultSettings] = useState<SubscribeSetting | null>()
  const { showMessage, renderNode } = useCommonMessage()
  const refreshDefaultSettings = () => {
    getSubscribeSetting().then(response=>{
      if (response) {
        setDefaultSettings({
          ...response,
          items: response?.items || []
        })
      }
    })
  }

  useEffect(refreshDefaultSettings, [])

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

  return (
    <div>
      {renderNode}
      <Header title={"订阅管理"} titleColor={"#000"}
        right={<button onTouchEnd={() => {
          baseFeeForm.trigger().then(valid => {
            if (valid) {
              addSubscribeSetting({
                price: baseFormValues.price,
                id: defaultSettings?.id
              }).then(data => {
                if (data) {
                  showMessage("修改成功", "default", {
                    afterDuration: router.back
                  })
                }
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
                  <InputWithLabel
                    errorMessage={fieldState.error?.message}
                    onInputChange={field.onChange}
                    onBlur={event => {
                      field.onChange(Number(event.target.value).toFixed(2))
                    }}
                    value={field.value} label={"每月价格"} description={(
                      <>
                        <div>最小价格$1.99 USDT 或免费</div>
                        您必须先开通 <span className="text-main-pink">Potato钱包</span>，然后才能设置订阅价格或收取打赏
                      </>
                    )}
                  />
                )
              }} name={"price"} control={baseFeeForm.control}
              />
            </section>
          </form>
        </section>
        <SubscribeBundle initSettings={defaultSettings?.items || []} refresh={refreshDefaultSettings}/>
        <PromotionalActivities initDiscountList={discountConfig.initList} unsubList={discountConfig.unsubList}/>
      </section>
    </div>
  )
}