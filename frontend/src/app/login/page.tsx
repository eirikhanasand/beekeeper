'use client'

import handleAuthResponse from "@/utils/handleAuthResponse"
import { useEffect } from "react"

export default function Login() {
    useEffect(() => {
        handleAuthResponse()
    }, [])
}
