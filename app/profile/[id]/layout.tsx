import React from "react";
import "./profile.scss"
export default function Layout(props: { 
    children: React.ReactNode;
    modal: React.ReactNode; 
}) {
    return (
        <>
            {props.children}
            {props.modal}
            <div id="modal-root" />
            <div id="modal-inner" />
        </>
    )
}
