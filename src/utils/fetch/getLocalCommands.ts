import { API, BROWSER_API } from "@parent/constants"

export default async function getLocalCommands(location: 'server' | 'client', service: string): Promise<LocalCommand[]> {
    const url = location === 'server' ? `${API}/commands/local` : `${BROWSER_API}/commands/local`

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
    
        const commands = await response.json()
        return commands.filter((command: LocalCommand) => command.namespace.toLowerCase() === service)
    } catch (error) {
        console.error(error)
        return []
    }
}
