import config from "@/constants"

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default async function getContexts(location: 'server' | 'client'): Promise<ServiceAsList[]> {
    const url = location === 'server' ? `${config.url.API}/contexts` : `${API_URL}/contexts`

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
        console.log(error)
        return []
    }
}
