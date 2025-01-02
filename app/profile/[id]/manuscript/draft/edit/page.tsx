"use client"
import React, {HTMLAttributes, useCallback, useEffect, useState} from "react";
import clsx from "clsx";
import IconWithImage from "@/components/profile/icon";
import {RadioGroup, RadioGroupItem} from "@/components/ui/radio-group";
import {Switch} from "@/components/ui/switch";
import {useRouter} from "next/navigation";
import FormDrawer from "@/components/common/form-drawer";
import InputWithLabel from "@/components/profile/input-with-label";
import SheetSelect, {ISelectOption} from "@/components/common/sheet-select";
import ConfirmModal from "@/components/common/confirm-modal";
import {mediaUpload} from "@/lib/data";
import {Controller, useFieldArray, useForm, UseFormSetValue,} from "react-hook-form";
import {addPost, iPost, iPostAttachment, iPostVote, postValidation, postVoteValidation} from "@/lib/post";
import {zodResolver} from "@hookform/resolvers/zod";
import DatePickerModal from "@/components/common/date-picker-modal";
import dayjs from "dayjs";
import Image from "next/image";

const ItemEditTitle = ({title, showIcon = true}: { title: React.ReactNode, showIcon?: boolean }) => {
    return <div className="flex gap-2.5 items-center">
        <div className="font-bold text-base">{title}</div>
        {showIcon && <IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20} color={'#bbb'}/>}
    </div>
}

const FormItemWithSelect = ({label, value, options, onValueChange}: {
    label: React.ReactNode,
    options: ISelectOption[],
    value: unknown,
    className?: Pick<HTMLAttributes<HTMLElement>, "className">,
    onValueChange?: (value: unknown) => void
}) => {
    const showLabel = options.find(item => item.value === value)?.label
    return <section className="flex justify-between items-center border-b border-[#ddd] py-4">
        <div>{label}</div>
        <SheetSelect outerControl={false} options={options} onInputChange={onValueChange}>
            <div className={"flex items-center justify-center gap-1.5 text-[#777]"}>
                <span>{showLabel}</span>
                <IconWithImage url={"/icons/profile/icon_arrow_right@3x.png"} width={16} height={16} color={'#ddd'}/>
            </div>
        </SheetSelect>
    </section>
}

const AddVoteModal = ({children, initFormData, updateVoteData}: {
    children: React.ReactNode,
    initFormData?: iPostVote,
    updateVoteData: (data: iPostVote) => void
}) => {
    const [open, setIsOpen] = useState<boolean>(false)
    const voteForm = useForm<iPostVote>({
        mode: "all",
        resolver: zodResolver(postVoteValidation),
        defaultValues: initFormData ?? {
            items: [],
            title: "",
            stop_time: Date.now(),
            mu_select: false
        }
    })
    const { formState,reset, handleSubmit, control} = voteForm
    const {fields: itemsList, append,} = useFieldArray({
        control,
        name: "items"
    })
    const saveVote = (data: iPostVote) => {
        setIsOpen(false)
        updateVoteData(data)
    }
    useEffect(()=>{
        if (open) reset()
    },[open])

    useEffect(() => {
        if (voteForm.getValues().items.length === 0) {
            append({content: ""})
            append({content: ""})
        }
    }, [])

    return <>
        <button onTouchEnd={() => {
            setIsOpen(true)
        }}>{children}</button>
        <FormDrawer
            title={"发起投票"}
            isOpen={open}
            setIsOpen={setIsOpen}
            outerControl
            headerLeft={(close) => {
                return <button onTouchEnd={close} className={"text-base text-[#777]"}>
                    <IconWithImage url={"/icons/profile/icon_close@3x.png"} width={24} height={24} color={'#000'}/>
                </button>
            }}
            headerRight={(() => {
                return <button type={"submit"} className={"text-base text-main-pink"}>确定</button>
            })}
            trigger={children}
            handleSubmit={handleSubmit(saveVote)}
        >
            <section className={"py-5 px-4 border-b border-[#ddd]"}>
                <Controller control={control} render={({field})=>{
                    return <InputWithLabel value={field.value} onInputChange={field.onChange} label={"投票标题"}/>
                }} name="title" />
                <div className="text-xs text-red-600">{formState.errors.title?.message}</div>
            </section>
            <section className={"py-5 px-4 border-b border-[#ddd]"}>
                <h3 className="font-medium text-base mb-2">投票内容</h3>
                <section className="flex flex-col gap-5">
                    {/*{*/}
                    {/*    itemsList.map((field, index) => (<div key={field.id}*/}
                    {/*                                          className={"flex pt-[12px] pb-[12px] pl-4 pr-4 rounded-xl border border-[rgb(221,221,221)]"}>*/}
                    {/*        <input placeholder={"请输入投票内容"}*/}
                    {/*               className="flex-1 w-full font-medium" {...register(`items.${index}.content`)}/>*/}
                    {/*    </div>))*/}
                    {/*}*/}
                    {
                        itemsList.map((field, index)=> {
                            return <Controller key={field.id} name={`items.${index}.content`} control={control} render={({field})=>{
                                return <InputWithLabel value={field.value} onInputChange={field.onChange} label={"请输入投票内容"} />
                            }} />
                        })
                    }

                    {/*<InputWithLabel name={""} value={""} label={"选项1"} placeholder={'选项内容，最多20字'}/>*/}
                    {/*<InputWithLabel name={""} value={""} label={"选项2"} placeholder={'选项内容，最多20字'}/>*/}
                    <button
                        onTouchEnd={() => {
                            append({content: ""})
                        }}
                        className="flex gap-1.5 w-full rounded-xl border border-main-pink justify-center items-center py-2.5 text-main-pink">
                        <IconWithImage url={"/icons/profile/icon_add@3x.png"} color={'#FF8492'} width={20} height={20}/>
                        添加选项
                    </button>
                </section>
            </section>
            <section className="px-4">
                <Controller control={control} render={({field}) => {
                    return <FormItemWithSelect onValueChange={field.onChange} label={"单选/多选"} value={field.value}
                                               options={[{label: "单选", value: false}, {label: "多选", value: true}]}/>
                }} name={"mu_select"}/>
                <section className="flex justify-between items-center border-b border-[#ddd] py-4">
                    <div>截止时间</div>
                    <Controller control={control} render={({field}) => {
                        return <DatePickerModal onValueChange={(value) => {
                            field.onChange(dayjs(value).endOf("date").valueOf())
                        }} trigger={<button className={"flex items-center justify-center gap-1.5 text-[#777]"}>
                        <span>
                            <input className="text-right" readOnly
                                   value={dayjs(field.value).format("YYYY-MM-DD HH:mm")}/>
                        </span>
                            <IconWithImage url={"/icons/profile/icon_arrow_right@3x.png"} width={16} height={16}
                                           color={'#ddd'}/>
                        </button>}/>
                    }} name={"stop_time"}/>
                </section>
            </section>
        </FormDrawer>
    </>
}

const ReadSettings = ({children}: { children: React.ReactNode }) => {
    const selectOptions = [
        {label: "所有人", value: "1"},
        {label: "2", value: "2"}
    ]
    return <FormDrawer
        title={"阅览设置"}
        headerLeft={(close) => {
            return <button onTouchEnd={close} className={"text-base text-[#777]"}>
                <IconWithImage url={"/icons/profile/icon_close@3x.png"} width={24} height={24} color={'#000'}/>
            </button>
        }}
        headerRight={(close => {
            return <button onTouchEnd={close} className={"text-base text-main-pink"}>确定</button>
        })}
        trigger={children}
    >
        <section className={"px-4 mt-5"}>
            <h3>付费设置1</h3>
            <FormItemWithSelect label={"付费对象"} value={"1"} options={selectOptions}/>
            {/*<FormItemWithSelect label={"付费金额"} value={"0"} options={[{label: "0", value: "0"}, {label: "2", value: "2"}]}/>*/}
            <section className="flex justify-between items-center border-b border-[#ddd] py-4">
                <div className="shrink-0">付费金额</div>
                <input className="flex-1 text-right"/>
                <div className={"flex items-center justify-center gap-1.5 text-[#777]"}>
                    <IconWithImage url={"/icons/profile/icon_arrow_right@3x.png"} width={16} height={16}
                                   color={'#ddd'}/>
                </div>
            </section>
            <section className={"text-xs text-[#777] mt-1.5"}>金额0时，为免费</section>
        </section>
        {/*<section className={"px-4 mt-5 opacity-40"}>*/}
        {/*    <h3>付费设置2(无效)</h3>*/}
        {/*    <FormItemWithSelect label={"付费对象"} value={"1"}*/}
        {/*                        options={[{label: "所有人", value: "1"}, {label: "2", value: "2"}]}/>*/}
        {/*    <FormItemWithSelect label={"付费金额"} value={"0"}*/}
        {/*                        options={[{label: "0", value: "0"}, {label: "2", value: "2"}]}/>*/}
        {/*    <section className={"text-xs text-[#777] mt-1.5"}>金额0时，为免费</section>*/}
        {/*</section>*/}
    </FormDrawer>
}

enum UPLOAD_MEDIA_TYPE {
    PIC = "1", // 图片
    VIDEO = "2", // 视频
    OTHER = "3"// 其他附件
}

const getUploadMediaFileType = (file: File) => {
    const type = file.type.toLowerCase()
    if (type.includes("video")) {
        return UPLOAD_MEDIA_TYPE.VIDEO
    }
    if (type.includes("image")) {
        return UPLOAD_MEDIA_TYPE.PIC
    }
    return UPLOAD_MEDIA_TYPE.OTHER
}


const UploadMedia = ({attachments, setValue}: { attachments?: iPostAttachment[], setValue: UseFormSetValue<iPost> }) => {
    const addAttachments = useCallback((data: iPostAttachment) => {
        if (Array.isArray(attachments) && attachments.length) {
            setValue("post_attachment", [
                ...attachments,
                data
            ])
        } else {
            setValue("post_attachment", [data])
        }
    }, [attachments, setValue])
    // const removeAttachments = useCallback((index: number) => {
    //     if (attachments?.length) {
    //         const arr = [...attachments]
    //         arr.slice(index, 1)
    //         setValue("post_attachment", arr)
    //     }
    // }, [setValue, attachments])
    const handleUpload = (file: File) => {
        const fd = new FormData()
        const {size} = file
        const fileType = getUploadMediaFileType(file)
        fd.append("file_count", "1")
        fd.append("file_size", String(size))
        fd.append("file_type", fileType)
        fd.append("file", file)
        mediaUpload(fd).then(({code, data}) => {
            if (code === 0) {
                console.log(process.env.NEXT_PUBLIC_API_URL + data.file_id + `.${data.ext}`)
                addAttachments({
                    file_id: data.file_id
                })
            }
        })
    }
    return <>
        <Image src={"https://imfanstest.potato.im/api/v1/media/img/d78d3c90-4c21-4a60-bc67-48a71416d0c8"} width={200} height={200} alt={"123"} />
        {attachments?.map(item => <div
            key={item.file_id}
            className={"relative w-[100px] h-[100px] flex items-center justify-center bg-[#F4F5F5] rounded "}>
            {item.file_id}
        </div>)}
        <div className="relative w-[100px] h-[100px] flex items-center justify-center bg-[#F4F5F5] rounded ">
            <input type="file" multiple={false}
                   className="block w-full h-full absolute left-0 top-0 opacity-0 z-10" onChange={(event) => {
                if (event.target.files?.length) {
                    handleUpload(event.target.files[0])
                }
            }}/>
            <IconWithImage url={'/icons/profile/icon_add@3x.png'} width={24} height={24} color={'#000'}/>
            <div className="text-[#bbb] text-xs text-center absolute bottom-2">视频/图片</div>
        </div>
    </>
}

const initPostFormData: iPost = {
    post: {
        notice: false,
        title: ""
    },
    post_attachment: [],
    post_price: [
        {
            "price": 333,
            "user_type": 0,
            "visibility": true
        }
    ],
    post_vote: undefined
}


export default function Page() {
    const router = useRouter()
    const onFormSubmit = (formData: iPost) => {
        addPost(formData).then((data) => {
            console.log(data)
        })
    }

    const postForm = useForm<iPost>({
        mode: "onTouched",
        resolver: zodResolver(postValidation),
        defaultValues: {...initPostFormData}
    })
    const {register, formState, getValues, setValue, handleSubmit} = postForm

    const noticeRegister = register("post.notice")

    const formValues = getValues()


    return <form onSubmit={handleSubmit(onFormSubmit)}>
        <section className="flex justify-between h-11 items-center pl-4 pr-4 ">
            <ConfirmModal content={"未发布的内容是否保存到草稿中？"} confirm={() => {
                console.log('保存到草稿')
                router.back()
            }} cancel={router.back}
                          trigger={<button>
                              <IconWithImage url={"/icons/profile/icon_close@3x.png"} width={24} height={24}
                                             color={'#000'}/>
                          </button>}
            />
            <button type="submit"
                    className={clsx(!formState.isValid ? "text-[#bbb]" : "#000")}>发布
            </button>
        </section>

        <section className="pt-5 pb-5 pl-4 pr-4 border-b border-gray-200 flex gap-2.5 flex-wrap">
            <UploadMedia setValue={setValue} attachments={formValues.post_attachment}/>
        </section>
        <section className="pt-5 pb-5 pl-4 pr-4 border-b border-gray-200 relative">
            <textarea {...register("post.title")} className="resize-none block w-full" maxLength={999}
                      placeholder="分享我的感受"
                      rows={5}/>
            <div
                className="absolute left-4 bottom-1.5 w-full text-red-600 text-xs">{formState?.errors?.post?.title?.message}</div>
        </section>
        {
            formValues.post_vote !== undefined && (
                <section className="pt-5 pb-5 pl-4 pr-4 border-b border-gray-200">
                    <section className="flex justify-between">
                        <div className="flex gap-2.5 items-center">
                            <div className="font-bold text-base">发起了一个投票:</div>
                            {/*<AddVoteModal>*/}
                            <button><IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20}
                                                   color={'#bbb'}/></button>
                            {/*</AddVoteModal>*/}
                        </div>
                        <button onTouchEnd={() => {
                            setValue("post_vote", undefined)
                        }}>
                            <IconWithImage url={"/icons/profile/icon_close@3x.png"} width={24} height={24} color={'#000'}/>
                        </button>
                    </section>
                    <section className="mt-2.5 rounded-xl bg-[#F4F5F5] px-3 py-2">
                        <div className="flex gap-2.5 items-center">
                            <IconWithImage url={"/icons/profile/icon_fans_vote@3x.png"} width={20} height={20}
                                           color={'#FF8492'}/>
                            <span className="font-bold text-main-pink text-base">投票名称</span>
                        </div>
                        <div className="text-xs text-[#999] mt-1.5">截止：2012-01-01 12:12 结束</div>
                    </section>
                </section>
            )
        }
        <section className="pt-5 pb-5 pl-4 pr-4 border-b border-gray-200">
            {/*<ItemEditTitle title={"阅览设置："}/>*/}
            <div className="flex gap-2.5 items-center">
                <div className="font-bold text-base">阅览设置：</div>
                <ReadSettings>
                    <button><IconWithImage url={"/icons/profile/icon_edit@3x.png"} width={20} height={20}
                                           color={'#bbb'}/></button>
                </ReadSettings>
            </div>
            <RadioGroup defaultValue="option-one" className="mt-2.5">
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-one" id="option-one" className="text-main-pink border-main-pink"/>
                    <label htmlFor="option-one" className={"text-main-pink"}>免费订阅</label>
                </div>
                <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option-two" id="option-two"/>
                    <label htmlFor="option-two" className={"text-main-pink"}>无法浏览-订阅者</label>
                </div>
            </RadioGroup>
        </section>
        <section className="pt-5 pb-5 pl-4 pr-4 ">
            <ItemEditTitle showIcon={false} title={'发布通知'}/>
            <section className="border-b border-gray-200 flex justify-between items-center py-3">
                <div>订阅者</div>
                <Switch {...noticeRegister} onCheckedChange={(value) => {
                    setValue("post.notice", value)
                }}></Switch>
            </section>
        </section>
        <section className="text-center pb-5">
            <AddVoteModal updateVoteData={(data) => {
                setValue("post_vote", data)
            }}>
                {
                    formValues.post_vote === undefined && (<span
                        className="inline-flex w-[165px] items-center justify-center rounded-xl gap-2 border border-main-pink py-2 text-main-pink text-base">
                        <IconWithImage url={"/icons/profile/icon_fans_vote@3x.png"} width={20} height={20}
                                       color={'#FF8492'}/>
                        投票
                    </span>)
                }
            </AddVoteModal>
        </section>
    </form>
}