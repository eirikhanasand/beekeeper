'use client'

import { removeItem } from "./localStorage"

// Function to logout the user
export async function sendLogout(): Promise<Boolean | string> {
    try {
        // Removes user items from localstorage if the user wants to log out
        removeItem('access_token')
        removeItem('name')
        removeItem('id')
        removeItem('groups')
        removeItem('redirect')
        removeItem('email')
        window.location.reload()

        window.location.href = '/login'
        return "Logged out successfully."
    } catch (error) {
        return `Failed to log out: ${error}`
    }
}

// Redirects the user to the page they were trying to access after successful login or register
export function getRedirect(alternative?: string): void {
    const redirect = localStorage.getItem('redirect')

    if (redirect) {
        window.location.href = redirect
        localStorage.removeItem('redirect')
    }

    if (alternative) {
        window.location.href = alternative
    }
}
