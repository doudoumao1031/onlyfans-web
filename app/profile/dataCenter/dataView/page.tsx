import DataViewItem from "@/components/profile/dataCenter/dataViewItem"

export default function Page() {
  const dataOptions = {
    play_count: "播放量",
    access_count: "空间访客",
    subscribe_count: "订阅量"
  }
  const focusOptions = {
    following_count: "新增关注",
    following_del_count: "取消关注",
    following_all_count: "总关注"
  }
  return (
    <>
      <DataViewItem title="数据流量" tabs={dataOptions} />
      <DataViewItem title="关注变化" tabs={focusOptions} />
    </>
  )
}
