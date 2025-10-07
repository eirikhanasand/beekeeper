import { setCookie } from "@/utils/cookies"
import debug from '@/utils/debug'
import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime"

type PutLocalCommandProps = {
    router: AppRouterInstance
    token: string
    id: string
    context: string
    name: string
    namespace: string
    command: string
    author: string
    reason: string
}

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default async function putLocalCommand({ router, token, id, context, name, namespace, command, author, reason }: PutLocalCommandProps) {    
    try {
        const response = await fetch(`${API_URL}/commands/local`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id, context, name, namespace, command, author, reason })
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
        debug({ basic: error })
        return 400
    }
}
