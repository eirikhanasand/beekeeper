import config from "@/constants"

type GetIngressEventsProps = {
    location: 'server' | 'client'
    context: string
    namespace: string
    name: string
}

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default async function getIngressEvents({location, context, namespace, name}: GetIngressEventsProps): Promise<string[]> {
    const url = `${location === 'server' ? config.url.API : API_URL}/namespaces/ingress/events/${context}/${namespace}/${name}`

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
        console.error(error)
        return []
    }
}
