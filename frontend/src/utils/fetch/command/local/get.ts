import config from "@/constants"

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default async function getLocalCommands(location: 'server' | 'client', service: string): Promise<LocalCommand[]> {
    const url = location === 'server' ? `${config.url.API}/commands/local` : `${API_URL}/commands/local`

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
        
        if (!response.ok) {
            const data = await response.text()
            throw Error(data)
        }
    
        const commands = await response.json()
        return commands.filter((command: LocalCommand) => command.namespace.toLowerCase() === service)
    } catch (error) {
        console.error(error)
        return []
    }
}
