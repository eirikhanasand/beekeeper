import config from "@/constants"

export default async function getIngress(location: 'server' | 'client', context: string, namespace: string): Promise<string[]> {
    const url = `${location === 'server' ? config.url.API : process.env.NEXT_PUBLIC_BROWSER_API}/ingress/${context}/${namespace}`

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
