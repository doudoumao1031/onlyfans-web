'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
    { name: 'Subscribed', href: '/explore/subscribed' },
    { name: 'Followed', href: '/explore/followed' },
    { name: 'Posts', href: '/explore/posts' },
    { name: 'Recommended', href: '/explore/recommended' },
  ];
  

  export default function NavLinks() {
    const pathname = usePathname();
    return (
      <div className="flex w-full border-b border-gray-300">
        {links.map((link) => (
          <Link
            key={link.name}
            href={link.href}
            className={clsx(
              'flex grow items-center justify-center text-sm font-medium py-2 hover:text-blue-600',
              {
                'border-b-2 border-blue-600 text-blue-600': pathname === link.href,
                'text-gray-700': pathname !== link.href,
              }
            )}
          >
            {link.name}
          </Link>
        ))}
      </div>
    );
  }