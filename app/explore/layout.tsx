import Header from '@/components/common/header';
import Nav from '@/components/explore/nav'

export default function Layout(
  props: { 
    children: React.ReactNode;
    modal: React.ReactNode; 
  }
) {
  return (
    <>
      {props.modal}
      <div className="flex h-screen flex-col w-full justify-start items-center">
          <Header />
          <Nav />
          <div className="grow px-4 py-3 w-full h-3/4">{props.children}</div>
      </div>
      <div id="modal-root" />
    </>
  );
}
