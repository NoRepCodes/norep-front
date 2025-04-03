// import React from 'react'
import { useState } from "react"

const body = document.getElementById('body');
const showScroll = () => { if (body) body.style.overflow = 'auto' }
const hideScroll = () => { if (body) body.style.overflow = 'hidden' }

// type ModalT = ():[modal:boolean,toggle:()=>void]
// type ModalT = (boolean | (() => void))[]
const useModal = ():[boolean,(state?:boolean)=>void] => {
    const [modal, setModal] = useState<boolean>(false)

    const toggle = (state?:boolean) => {
        if(state) return setModal(state)
        if (modal) showScroll()
        else hideScroll()
        setModal(!modal);
    };

    return [modal, toggle]

}

export default useModal