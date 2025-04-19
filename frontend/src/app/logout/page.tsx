'use client'

import { removeCookies } from "@/utils/cookies"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function Logout() {
    const router = useRouter()
    useEffect(() => {
        removeCookies('id', 'name', 'email', 'groups', 'access_token')
        router.push('/')
        router.refresh()
    }, [])
}
