import { API, BROWSER_API } from "@parent/constants"

export default async function getNamespaces(location: 'server' | 'client'): Promise<ServiceAsList[]> {
    const url = location === 'server' ? `${API}/namespaces` : `${BROWSER_API}/namespaces`

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
