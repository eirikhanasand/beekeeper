import config from "@/constants"

export default async function getNamespaces(location: 'server' | 'client'): Promise<ServiceAsList[]> {
    const url = location === 'server' ? `${config.url.API}/namespaces` : `${process.env.NEXT_PUBLIC_BROWSER_API}/namespaces`

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
        console.error(error)
        return []
    }
}
