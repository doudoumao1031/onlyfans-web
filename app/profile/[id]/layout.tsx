import React from "react";
import "./profile.scss"
import {redirect} from "next/navigation";
import {isNumber} from "lodash";

export default async function Layout(props: {
    children: React.ReactNode;
    modal: React.ReactNode;
    params: Promise<{ id: string }>
}) {
    const {id} = await props.params
    const numberId = Number(id)
    if (!isNumber(numberId) || isNaN(numberId) || numberId < 1) {
        redirect("/")
    }
    return (
        <>
            {props.children}
            {props.modal}
            <div id="modal-root"/>
            <div id="modal-inner"/>
        </>
    )
}
