import config from "@/constants"
import debug from "@/utils/debug"

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default async function getLogs(location: 'server' | 'client', path: 'global' | 'local'): Promise<(LocalLog | GlobalLog)[]> {
    const url = location === 'server' ? `${config.url.API}/log/${path}` : `${API_URL}/log/${path}`

    debug({
        basic: `Fetching logs from ${url}`,
        detailed: `Fetching logs (${location}) from ${url}`,
    })

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
            debug({ detailed: { message: `Fetching logs (${location}) from ${url} failed`, data } })
            throw Error(data.error)
        }
        
        const services = await response.json()
        debug({ full: { message: `Fetching logs (${location}) with url ${url} completed successfully`, data: services } })
        return services
    } catch (error) {
        debug({ production: { message: `Fetching logs (${location}) from ${url} failed`, error } })
        return []
    }
}
