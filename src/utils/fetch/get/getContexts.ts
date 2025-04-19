import config from "@/constants"

export default async function getContexts(location: 'server' | 'client'): Promise<ServiceAsList[]> {
    const url = location === 'server' ? `${config.url.API}/contexts` : `${process.env.NEXT_PUBLIC_BROWSER_API}/contexts`

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
