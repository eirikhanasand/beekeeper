'use client'

import { useEffect } from "react"

// Sets user in localStorage based on URL params
export default function Login() {
    useEffect(() => {
        const url = window.location.href
        const query = new URLSearchParams(new URL(url).search)
        const id = query.get('id') as string
        const email = query.get('email') as string
        
        // Sets the user object in localStorage based on URL params
        localStorage.setItem('id', id)
        localStorage.setItem('name', query.get('name') as string)
        localStorage.setItem('email', email)
        localStorage.setItem('groups', query.get('groups') as string)
        localStorage.setItem('token', query.get('access_token') as string)

        // Needs local db
        // getDetails({ id, name, username })

        // Redirects back to where the user was
        const path = localStorage.getItem('redirect') || '/'
        localStorage.removeItem('redirect')
        window.location.href = path
    }, [])
}
