import config from "@/constants"

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default async function getIncidents(location: 'server' | 'client', context: string, service: string): Promise<Incident[]> {
    const url =  `${location === 'server' ? config.url.API : API_URL}/namespaces/incidents/${context}/${service}`

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
    
        const incidents = await response.json()
        return incidents
    } catch (error) {
        console.log(error)
        return []
    }
}
