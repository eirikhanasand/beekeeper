'use client'

import redirectToValidPage from "@/utils/redirectToValidPage"
import { useEffect } from "react"

export default function Login() {
    useEffect(() => {
        redirectToValidPage()
    }, [])
}
