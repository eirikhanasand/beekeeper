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
        const token = formData.get("token") as string

        try {
            const response = await fetch(`${API_URL}/token/btg`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })

            if (!response.ok) {
                throw new Error(await response.text())
            }

            setCookie("access_token", token, 1)
            setCookie("groups", "tekkom", 1)

        } catch (error) {
            setErrorMessage(error instanceof Error ? error.message : "Unknown error! Please contact TekKom")
        }
    }

    return (
        <div>
            {loginUnavailable ? (
                <>
                    <form className="flex flex-col gap-4 p-4 rounded-xl w-80 mx-auto" onSubmit={handleSubmit}>
                        <input
                            type="password"
                            id="token"
                            name="token"
                            className="border rounded px-3 py-2"
                            autoComplete="current-password"
                            placeholder="Token"
                        />
                        <button
                            type="submit"
                            className="bg-login text-dark px-5 py-2 rounded-xl cursor-pointer mt-2"
                        >
                            Login
                        </button>
                    </form>
                    <p className="text-red-500">{errorMessage}</p>
                </>
            ) : (
                <Link 
                    href={`${API_URL}/login`} 
                    className='bg-login text-dark px-5 rounded-xl cursor-pointer'
                >
                    Login
                </Link>
            )}
        </div>
    )
}