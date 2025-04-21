import config from "@/constants"

export default async function getServiceMessages(location: 'server' | 'client'): Promise<ServiceMessage[]> {
    const url =  `${location === 'server' ? config.url.API : process.env.NEXT_PUBLIC_BROWSER_API}/service/messages`

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
    
        const messages = await response.json()
        return messages
    } catch (error) {
        console.error(error)
        return []
    }
}
