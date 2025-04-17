'use client'

import { BROWSER_API } from "@parent/constants"
import { sendLogout } from "@utils/user"
import Image from "next/image"
import Link from "next/link"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import { Burger } from "./burger"
import ThemeSwitch from "./theme/themeSwitch"
import { getCookie } from "@/utils/cookies"

type MiddleIconProps = {
    setActive: Dispatch<SetStateAction<boolean>>
}

// Displays the login icon or the profile icon depending on the login status
export function RightIcon() {
    const [href, setHref] = useState('/login')
    const [icon, setIcon] = useState("/images/join.svg")
    const loggedIn = false

    function handleClick() {
        localStorage.setItem('redirect', window.location.href)
    }

    useEffect(() => {
        if (loggedIn) {
            setHref(`/profile/${loggedIn}`)
            setIcon("/images/profile.svg")
        } else {
            setHref(`${BROWSER_API}/login`)
            setIcon("/images/join.svg")
        }
    }, [loggedIn])

    if (!loggedIn) {
        return <></>
    }

    return (
        <Link 
            href={href} 
            className='grid place-self-center w-[3vh] h-[3vh] relative'
            onClick={handleClick}
        >
            <Image src={icon} alt="logo" fill={true} />
        </Link>
    )
}

// Displays the register icon or the logout icon depending on the login status
export function MiddleIcon() {
    const icon = "/images/logout.svg"
    const [loggedIn, setLoggedIn] = useState(false)

    useEffect(() => {
        const token = getCookie('access_token')
        if (token) {
            setLoggedIn(true)
        }
    }, [])

    function handleClick() {
        if (loggedIn) {
            sendLogout()
        }
    }

    if (!loggedIn) {
        return <></>
    }

    return (
        <Link 
            href="/logout"
            className='grid place-self-center w-[3vh] h-[3vh] relative' 
            onClick={handleClick}
        >
            <Image src={icon} alt="logo" fill={true} />
        </Link>
    )
}

export function RightSide() {
    return (
        <div className={`flex justify-end rounded-xl gap-2 md:min-w-[10rem]`}>
            <MiddleIcon />
            <RightIcon />
            <ThemeSwitch />
            <Burger />
        </div>
    )
}
