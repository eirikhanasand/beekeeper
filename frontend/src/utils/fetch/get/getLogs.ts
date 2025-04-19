import config from "@/constants"

export default async function getLogs(location: 'server' | 'client', path: 'global' | 'local'): Promise<(LocalLog | GlobalLog)[]> {
    const url = location === 'server' ? `${config.url.API}/log/${path}` : `${process.env.NEXT_PUBLIC_BROWSER_API}/log/${path}`

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
