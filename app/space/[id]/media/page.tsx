import MediaItem from '@/components/space/mediaItem'
export default function Page() {
    const mockData = [
        {
            bg: "bg-[url('/demo/girl1.jpeg')]",
            msg: '视频简介内容...',
            subscribe: true,
            isSub: false,
            duration: 99.99,
            type: 'video',
            subFees: 99.99,
            isClick: false,
            src:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'
        },
        {
            bg: "bg-[url('/demo/girl2.jpeg')]",
            msg: '视频简介内容...',
            subscribe: false,
            isSub: false,
            duration: 99.99,
            type: 'video',
            subFees: 99.99,
            isClick: false,
            src:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

        },
        {
            bg: "bg-[url('/demo/girl3.jpeg')]",
            msg: '视频简介内容...',
            subscribe: true,
            isSub: false,
            duration: 99.99,
            type: 'video',
            subFees: 99.99,
            isClick: false,
            src:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

        },
        {
            bg: "bg-[url('/demo/girl4.jpeg')]",
            msg: '视频简介内容...',
            subscribe: true,
            isSub: false,
            duration: 99.99,
            type: 'video',
            subFees: 99.99,
            isClick: false,
            src:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

        },
        {
            bg: "bg-[url('/demo/girl5.jpeg')]",
            msg: '视频简介内容...',
            subscribe: true,
            isSub: false,
            duration: 99.99,
            type: 'video',
            subFees: 99.99,
            isClick: false,
            src:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

        },
        {
            bg: "bg-[url('/demo/girl6.jpeg')]",
            msg: '视频简介内容...',
            subscribe: false,
            isSub: false,
            duration: 99.99,
            type: 'video',
            subFees: 99.99,
            isClick: false,
            src:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

        },
        {
            bg: "bg-[url('/demo/girl7.jpeg')]",
            msg: '视频简介内容...',
            subscribe: true,
            isSub: false,
            duration: 99.99,
            type: 'video',
            subFees: 99.99,
            isClick: false,
            src:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

        },
        {
            bg: "bg-[url('/demo/girl8.jpeg')]",
            msg: '视频简介内容...',
            subscribe: true,
            isSub: false,
            duration: 99.99,
            type: 'video',
            subFees: 99.99,
            isClick: false,
            src:'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

        },
    ]
    return (
        <div className="flex justify-between flex-wrap">
            {mockData.map((v, i) => {
                return <MediaItem item={v} key={i}/>
            })}

        </div>
    );
}