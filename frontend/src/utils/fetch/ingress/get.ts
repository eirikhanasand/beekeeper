import config from "@/constants"
import { debug } from 'console'

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default async function getIngress(location: 'server' | 'client', context: string, namespace: string): Promise<Ingress[]> {
    const url = `${location === 'server' ? config.url.API : API_URL}/namespaces/ingress/${context}/${namespace}`

    try {
        const response = await fetch(url, {
            next: { revalidate: 10 },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            const data = await response.json()

            throw Error(data.error)
        }

        const services = await response.json()
        return services
    } catch (error) {
        debug({ basic: error })
        return []
    }
}
