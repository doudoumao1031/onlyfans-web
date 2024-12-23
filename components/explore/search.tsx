'use client';

import {useSearchParams, usePathname, useRouter} from 'next/navigation';
import {useDebouncedCallback} from 'use-debounce';
import Image from "next/image";

export default function Search({placeholder}: { placeholder: string }) {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const {replace, back} = useRouter();
    const handleSearch = useDebouncedCallback((term) => {
        console.log(`Searching... ${term}`);

        const params = new URLSearchParams(searchParams);
        params.set('page', '1');
        if (term) {
            params.set('query', term);
        } else {
            params.delete('query');
        }
        replace(`${pathname}?${params.toString()}`);
    }, 300);
    return (
        <div className="w-full h-12 pl-3 pr-4 py-[6px] relative flex justify-between items-center">
            <input className="w-full h-full bg-gray-50 rounded-full mr-4 pl-8"
                   placeholder={placeholder}
                   onChange={(e) => {
                       handleSearch(e.target.value);
                   }}
                   defaultValue={searchParams.get('query')?.toString()}/>
            <Image src="/icons/explore/icon_search_s@3x.png" alt="search"
                   width={18}
                   height={18}
                   className="absolute top-1/3 left-6"
            />
            <button onTouchEnd={()=>{back()}}>
                <span className="text-main-pink text-lg font-normal text-nowrap w-8">取消</span>
            </button>
        </div>
    );
}
