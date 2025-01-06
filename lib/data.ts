import {getPostData} from "@/components/post/mock"
import {PostData} from "@/components/post/type"
// import {HttpsProxyAgent} from 'https-proxy-agent';
// import fetch, { RequestInit } from 'node-fetch';
import {BloggerInfo} from "@/lib/struct";

export async function fetchFeeds(
    currentPage: number,
) {
    // Add artificial latency
    await new Promise(resolve => setTimeout(resolve, 1000))

    // Mock data generation
    const mockItems: PostData[] = Array(5).fill(null).map((_, index) => ({
        ...getPostData(),
        id: `post-${index + (currentPage - 1) * 5}`,
        poster: {
            ...getPostData().poster,
            name: `Creator ${index + 1 + (currentPage - 1) * 5}`,
            id: `creator${index + 1 + (currentPage - 1) * 5}`,
        }
    }));

    return {
        items: mockItems,
        hasMore: currentPage < 6, // Mock 6 pages of content
    };
}

const apiUrl = process.env.NEXT_PUBLIC_API_URL;
// const proxyUrl = process.env.NEXT_PROXY_URL || "http://127.0.0.1:8889";
export type PostResult = {
    code: number,
    data: unknown,
    message: string,
}

/**
 * 分页公共请求
 */
export type CommonPageReq = {
    from_id: number | 0,
    page: number | 1,
    pageSize: number | 10
}
export type recomBloggerReq = CommonPageReq & {
    // 0 热门 1 新人 2人气
    type: number,
}
/**
* list 返回结果
*/
export type PageResponse<T> = {
    list: T[],
    total: number,
}
/**
 * 搜索用户请求
 */
export type SearchUserReq = CommonPageReq & {
    name: string
}
/**
 * 搜索帖子请求
 */
export type SearchPostReq = CommonPageReq & {
    title: string
}

/**
 * 帖子内容列表
 */
export type PostResp = {
    collection: boolean,
    mention_user: BloggerInfo[],
    post: PostData,
    post_attachment: {
        file_id: string,
        file_name: string,
        file_size: number,
        file_type: number,
        id: number,
        post_id: number,
        thumb_id: string,
        user_id: number
    },
    post_metric: {
        collection_count: number,
        comment_count: number,
        play_count: number,
        share_count: number,
        thumbs_up_count: number,
        tip_count: number
    },
    post_price: {
        id: number,
        price: number,
        user_type: number,
        visibility: boolean
    }[],
    post_vote: {
        id: number,
        items: {
            content: string,
            id: number,
            vote_count: number,
            vote_id: number
        }[],
        mu_select: boolean,
        stop_time: number,
        title: string
    },
    star: boolean,
    user: BloggerInfo
}


export type UserReq = {
    user_id: number
}

/**
 * 订阅折扣
 */
export type DiscountInfo = {
    discount_end_time: number,
    discount_per: number,
    discount_price: number,
    discount_start_time: number,
    discount_status: boolean,
    id: number,
    month_count: number,
    price: number,
    user_id: number
}
/**
 * 订阅设置
 */
export type SubscribeSetting = {
    id: number,
    user_id: number,
    price: number,
    items: DiscountInfo[]
}

export async function callApi<T, R>(
    url: string,
    data: T,
    transformResponse: (response: PostResult) => R
): Promise<R | null> {
    /*const agent  = new HttpsProxyAgent(proxyUrl);
    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'X-Token': '1',
        },
        body: JSON.stringify(data),
        // agent: agent,
    };*/
    try {
        const response = await fetch(apiUrl + url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Token': '20241400',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            const postResult: PostResult = await response.json();
            // console.log('Success:', postResult);
            return transformResponse(postResult);
        } else {
            console.error('Error-01:', response.status, response.statusText);
            const errorText = await response.text();
            console.error('Error details:', errorText);
        }
    } catch (error) {
        console.error('Error-catch:', error);
    }
    return null;
}

async function postData(url: string, data: unknown) {
    try {
        const response = await fetch(apiUrl + url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'X-Token': '20241400',
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            const PostResult = await response.json();
            console.log('Success:', PostResult);
            return PostResult;
        } else {
            console.error('Error:', response.status, response.statusText);
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

/**
 * 登陆
 * @param userId
 */
export async function login(userId: number) {
    console.log("login user-id :", userId)
    const req = {
        "user_id": userId
    }
    return await callApi<UserReq, string>('/auth/login', req, (response) => {
        return response.data as string;
    });
}

export type FollowUserPostReq = {
    from_id: number,
    page: number,
    pageSize: number,
}

/**
 * 关注用户帖子
 * @param data
 */
export async function followUserPosts(data: FollowUserPostReq) {
    console.log("followUserPosts data:", data);
    return await postData('/index/followUserPosts', data);
}

/**
 * 已经关注博主发布的贴子动态
 */
export async function followUserUpdate() {
    return await postData('/index/followUserUpdate', {});
}

/**
 * 推荐博主
 */
export async function recomBlogger(req: recomBloggerReq): Promise<PageResponse<BloggerInfo> | null> {
    return await callApi<recomBloggerReq, PageResponse<BloggerInfo>>('/index/recomBlogger', req, (response) => {
        return response.data as PageResponse<BloggerInfo>;
    });
}

/**
 * 热门贴子
 */
export async function systemPost() {
    return await postData('/index/systemPost', {});
}

//
/**
 * 已订阅博主列表
 */
export async function userCollectionUsers(req: CommonPageReq): Promise<PageResponse<BloggerInfo> | null> {
    return await callApi<CommonPageReq, PageResponse<BloggerInfo>>('/user/userCollectionUsers', req, (response) => {
        return response.data as PageResponse<BloggerInfo>;
    });
}

/**
 * 搜索用户
 */
export async function searchUser(req: SearchUserReq): Promise<PageResponse<BloggerInfo> | null> {
    return await callApi<SearchUserReq, PageResponse<BloggerInfo>>('/user/search', req, (response) => {
        return response.data as PageResponse<BloggerInfo>;
    });
}
/**
 * 搜索帖子
 */
export async function searchPost(req: SearchPostReq): Promise<PageResponse<PostResp[]> | null> {
    return await callApi<SearchPostReq, PageResponse<PostResp[]>>('/post/search', req, (response) => {
        return response.data as PageResponse<PostResp[]>;
    });
}

/**
 * 查看用户订阅设置
 */
export async function viewUserSubscribeSetting(req: UserReq): Promise<SubscribeSetting | null> {
    return await callApi<UserReq, SubscribeSetting>('/user/viewUserSubscribeSetting', req, (response) => {
        return response.data as SubscribeSetting;
    });
}