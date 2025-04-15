import { API, BROWSER_API } from "@parent/constants"

// Fetches the scoreboard from the server
export async function getScoreBoard() {
    try {
        const response = await fetch(`${API}/scoreboard`, {
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
    
        return await response.json()
    } catch (error: unknown) {
        const err = error as Error
        return err.message
    }
}

// Fetches services from server, different url based on location, therefore the 
// location parameter to ensure all requests are successful
export async function getServices(location: 'server' | 'client'): Promise<ServiceAsList[] | string> {
    const url = location === 'server' ? `${API}/services` : `${BROWSER_API}/services`

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
        const err = error as Error
        return err.message
    }
}
