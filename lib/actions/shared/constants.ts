// API endpoints and other constants
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api"

export const ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    USERS: "/auth/users",
    LOGIN_TOKEN: "/auth/loginToken"
  },
  RECOM: {
    FOLLOW_USER_POSTS: "/index/followUserPosts",
    FOLLOW_USER_UPDATE: "/index/followUserUpdate",
    RECOM_BLOGGER: "/index/recomBlogger",
    SYSTEM_POST: "/index/systemPost"
  },
  MEDIA: {
    COMPLETE_FILE: "/media/completeFile",
    DOWNLOAD_RANGE: "/media/downloadRang",
    IMAGE: "/media/img",
    IMAGE_CUT: "/media/imgcut",
    UPLOAD: "/media/upload",
    UPLOAD_PART: "/media/uploadPart",
    VIDEO: "/media/video",
    VIDEO_CUT: "/media/videocut",
    MEDIA_ENC: "/media/enc",
    MEDIA_HLS: "/media/hls",
    MEDIA_HLSDATA: "/media/hlsdata"
  },
  POST: {
    ADD: "/post/add",
    DELETE_FILE: "/post/deletePostFile",
    DELETE_VOTE: "/post/deleteVote",
    DELETE_POST: "/post/delete",
    ME_MEDIAS: "/post/mePostMedias",
    ME_POSTS: "/post/mePosts",
    ME_DRAFT_POST: "/post/meDraftPosts",
    FILE_PLAY_LOG: "/post/postFilePlayLog",
    SHARE_LOG: "/post/postSharLog",
    VIEW_LOG: "/post/postViewLog",
    PUBLISH: "/post/pub",
    SEARCH: "/post/search",
    STAR: "/post/star",
    USER_MEDIAS: "/post/userPostMedias",
    USER_POSTS: "/post/userPosts",
    USER_VOTE: "/post/userVote",
    VIEW: "/post/view",
    PINED: "/post/pinned"
  },
  COMMENT: {
    ADD: "/post/comment",
    REPLY: "/post/commentReply",
    UP: "/post/commentUp",
    DELETE: "/post/deleteComment",
    GET_REPLIES: "/post/postCommentReplys",
    GET_COMMENTS: "/post/postComments"
  },
  USERS: {
    // Subscription related
    ADD_SUBSCRIBE_SETTING: "/user/addUserSubscribeSetting",
    ADD_SUBSCRIBE_SETTING_ITEM: "/user/addUserSubscribeSettingItem",
    DELETE_SUBSCRIBE_SETTING_ITEM: "/user/deleteUserSubscribeSettingItem",
    // 获取我的订阅博主
    GET_SUBSCRIBE_USERS: "/user/getSubscribeUsers",
    GET_SUBSCRIBED_USERS: "/user/getSubscribedUsers",
    GET_SUBSCRIBE_SETTING: "/user/getUserSubscribeSetting",
    VIEW_SUBSCRIBE_SETTING: "/user/viewUserSubscribeSetting",

    // Profile update related
    APPLY_BLOGGER: "/user/applyBlogger", // 申请成为博主
    UPDATE_ABOUT: "/user/updateUserAbout",
    UPDATE_BACK_IMG: "/user/updateUserBackImg",
    UPDATE_BASE: "/user/updateUserBase",
    UPDATE_LOCATION: "/user/updateUserLocation",
    UPDATE_PHOTO: "/user/updateUserPhoto",
    UPDATE_SUB_REPLAY: "/user/updateUserSubReplay",
    UPDATE_TOP_INFO: "/user/updateUserTopInfo",

    // Following related
    DELETE_FOLLOWING: "/user/deleteFollowing",
    FOLLOWING: "/user/following",
    GET_FOLLOWED_USERS: "/user/getFollowedUsers",
    GET_FOLLOWING_USERS: "/user/getFollowingUsers",

    // Basic users operations
    GET_USER_EXTEND: "/user/getUserExtend",
    ME: "/user/me",
    SEARCH: "/user/search",
    GET_BY_ID: "/user/uid",
    GET_BY_USERNAME: "/user/username",
    POST_VIEW_LOG: "/user/userPostViewLog",
    STAT_DAY_METRIC: "/user/userStatDayUserMetric", //用户每日统计
    STATEMENT: "/user/userStatement", // 查询用户收支明细
    PAT_STATEMENT: "/user/userPayStatement", // 查询用户支出记录
    STAT_INCOME: "/user/userStatIncome",
    SUB_ME_LOG: "/user/userSubMeLog", // 我的订阅记录
    VIEW_LOG: "/user/userViewLog",
    VIEW_LOGS: "/user/userViewLogs",
    VIEW_ME_LOGS: "/user/userViewMeLogs",
    WALLET_STATEMENT: "/user/userWalletStatement",
    WALLET_DOWN_ORDER: "/user/userWalletDownOrder", //用户提现记录
    WALLET: "/user/wallet", // 我的钱包（余额信息）
    PT_WALLET: "/user/ptWallet", // pt钱包信息（充值配置）

    // Collection related
    COLLECTION_POST: "/user/userCollectionPost",
    COLLECTION_POSTS: "/user/userCollectionPosts",
    COLLECTION_USER: "/user/userCollectionUser",
    COLLECTION_USERS: "/user/userCollectionUsers"
  },
  ORDERS: {
    ADD_POST_PAY: "/wallet/addPostPayOrder", //增加帖子付费记录
    ADD_POST_TIP: "/wallet/addPostTip",
    ADD_SUB: "/wallet/addSubOrder",
    ADD_WALLET_DOWN: "/wallet/addWalletDownOrder",
    ADD_WALLET: "/wallet/addWalletOrder",
    BACK_DOWN: "/wallet/backDownOrder",
    BACK_PAY_MONEY: "/wallet/backPayMoneyOrder",
    DELETE: "/wallet/deleteOrder"
  }
} as const
