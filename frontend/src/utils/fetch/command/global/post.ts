import { setCookie } from "@/utils/cookies"
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

type PostGlobalCommandProps = {
    router: AppRouterInstance
    token: string
    name: string
    command: string
    author: string
    reason: string
}

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default async function postGlobalCommand({ router, token, name, command, author, reason }: PostGlobalCommandProps): Promise<number> {    
    try {
        const response = await fetch(`${API_URL}/commands/global`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, command, author, reason })
        })
    
        if (!response.ok) {
            if (response.status === 400) {
                setCookie('command', command)
                setCookie('commandName', name)
                setCookie('commandReason', reason)
                setCookie('invalidToken', 'true')
                router.push('/logout')
                return 401
            } else {
                throw Error(await response.text())
            }
        }
    
        return response.status
    } catch (error) {
        console.error(error)
        return 400
    }
}
