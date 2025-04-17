import { API, BROWSER_API } from "@parent/constants"

export default async function getGlobalCommands(location: 'server' | 'client'): Promise<GlobalCommand[]> {
    const url = location === 'server' ? `${API}/commands/global` : `${BROWSER_API}/commands/global`

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
        return commands
    } catch (error) {
        console.error(error)
        return []
    }
}
