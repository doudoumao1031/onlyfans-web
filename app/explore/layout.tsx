import Header from '@/ui/common/header';
import Nav from '@/ui/explore/nav'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen flex-col w-full justify-start items-center">
        <Header />
        <Nav />
        <div className="grow px-4 py-3 w-full h-3/4">{children}</div>
    </div>
  );
}
