/**
 * 博主信息
 */
export type BloggerInfo = {
    id: number;
    pt_user_id: number;
    first_name: string;
    last_name: string;
    username: string;
    status: number;
    photo: string;
    back_img: string;
    about: string;
    location: string;
    live_certification: boolean;
    blogger: boolean;
    post_count: number;
    media_count: number;
    video_count: number;
    img_count: number;
    fans_count: number;
    subscribe_count: number;
    following_count: number;
    collection_post_count: number;
    today_add_count: number;
    access_count: number;
    play_count: number;
    sub: boolean;
    sub_end_time: number;
    collection: boolean;
    following: boolean;
}