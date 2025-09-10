'use client'

import Link from "next/link"
import { useState, useEffect } from "react"
import { setCookie } from "@/utils/cookies"

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default function Login() {
    const loginUrl = `${API_URL}/login`
    const [loginUnavailable, setLoginUnavailable] = useState(false)
    const [errorMessage, setErrorMessage] = useState("")

    useEffect(() => {
            (async () => {
                try {
                    const response = await fetch(loginUrl, { method: 'HEAD' })
                    if (!response.ok) {
                        setLoginUnavailable(true)
                    }
                } catch (error) {
                    setLoginUnavailable(true)
                }
            })()
    }, [loginUrl])

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault()
        const formData = new FormData(e.currentTarget)
        const name = formData.get("name") as string
        const token = formData.get("token") as string

        try {
            const response = await fetch(`${API_URL}/token/btg`, {
                headers: {
                    Name: name,
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error(await response.text())
            }

            setCookie("name", name, 1)
            setCookie("access_token", token, 1)
            setCookie("groups", "tekkom", 1)
        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Unknown error! Please contact TekKom")
        }
    }

    if (loginUnavailable) {
        return (
            <div>
                <form className="flex flex-col gap-4 p-4 rounded-xl w-80 mx-auto" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        className="border-none rounded-xl px-3 py-2 bg-normal"
                        autoComplete="current-password"
                        placeholder="Name"
                    />
                    <input
                        type="password"
                        id="token"
                        name="token"
                        className="border-none rounded-xl px-3 py-2 bg-normal"
                        autoComplete="current-password"
                        placeholder="Token"
                    />
                    <button
                        type="submit"
                        className="bg-login text-dark px-5 py-1 rounded-xl cursor-pointer mt-2"
                    >
                        Login
                    </button>
                </form>
                <p className="text-red-500 text-center py-2 bg-normal rounded-xl">{errorMessage}</p>
            </div>
        )
    }

    return (
        <div>
            <Link 
                href={`${API_URL}/login`} 
                className='bg-login text-dark px-5 rounded-xl cursor-pointer'
            >
                Login
            </Link>
        </div>
    )
}
