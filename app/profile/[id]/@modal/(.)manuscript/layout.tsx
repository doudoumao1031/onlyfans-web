export default function Layout(props: { 
    children: React.ReactNode;
    innerModal: React.ReactNode; 
}) {
    return (
        <>
            {props.children}
            {props.innerModal}
        </>
    );
}