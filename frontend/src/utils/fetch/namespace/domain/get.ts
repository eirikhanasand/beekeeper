import config from "@/constants"
import debug from '@/utils/debug'

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default async function getDomains(location: 'server' | 'client', context: string, service: string): Promise<Domain[]> {
    const url =  `${location === 'server' ? config.url.API : API_URL}/namespaces/domains/${context}/${service}`
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
        
        const domains = await response.json()
        return domains
    } catch (error) {
        debug({ detailed: `Error fetching url in getDomains: ${url}`})
        return []
    }
}
