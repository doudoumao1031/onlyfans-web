export type UserProfile = {
  about: string //简介
  access_count: number //空间访客数量
  back_img: string //顶部头像
  blogger: boolean //是否博主
  collection: boolean //是否收藏
  collection_post_count: number //当前收藏/关注的帖子数量
  fans_count: number //粉丝数量
  first_name: string
  last_name: string
  following: boolean //是否关注
  following_count: number //关注其他博主的数量
  collection_user_count?: number //收藏博主数量，收藏帖子会自动收藏博主
  id: number
  img_count: number //图片数量
  live_certification: boolean //直播认证 0 未认证、1 已认证
  location: string //位置
  media_count: number //媒体数量
  photo: string //用户头像
  play_count: number //帖子/媒体播放数量
  post_count: number //帖子数量
  pt_user_id: number
  status: number // 1正常，2停用
  sub: boolean // 是否订阅
  sub_end_time: number //订阅结束时间
  subscribe_count: number //订阅数量
  today_add_count: number //当日新增帖子数量
  username: string
  video_count: number //媒体数量
}
