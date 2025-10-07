import config from "@/constants"
import debug from '@/utils/debug'

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default async function getPods(location: 'server' | 'client'): Promise<Pod[]> {
    const url = location === 'server' ? `${config.url.API}/pods` : `${API_URL}/pods`

    try {
        const response = await fetch(url, {
            next: { revalidate: 10 },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            const data = await response.text()
            throw Error(data)
        }

        const services = await response.json()
        return services
    } catch (error) {
        debug({ basic: error })
        return []
    }
}
