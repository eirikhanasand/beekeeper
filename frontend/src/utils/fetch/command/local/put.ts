import { setCookie } from "@/utils/cookies"
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

export default async function putLocalCommand({ router, token, id, context, name, namespace, command, author, reason }: PutLocalCommandProps) {    
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BROWSER_API}/commands/local`, {
            method: 'POST',
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
    
        const services = await response.json()
        return services
    } catch (error) {
        console.error(error)
        return []
    }
}
