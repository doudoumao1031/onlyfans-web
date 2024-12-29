import { getPostData } from "@/components/post/mock"
import { PostData } from "@/components/post/type"

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

export type PostResult = {
    code: number,
    data: unknown,
    message: string,
}

async function postData(url: string, data: unknown) {
    console.log("=====>post url:", url)
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
    return await postData('/auth/login', {});
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
export async function recomBlogger() {
    return await postData('/index/recomBlogger', {});
}

/**
 * 热门贴子
 */
export async function systemPost() {
    return await postData('/index/systemPost', {});
}

/**
 * 搜索
 */
export async function searchBlog() {
    return await postData('/index/systemPost', {query: "123"});
}