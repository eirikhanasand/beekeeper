import config from "@/constants"

export default async function getGlobalCommands(location: 'server' | 'client'): Promise<GlobalCommand[]> {
    const url = location === 'server' ? `${config.url.API}/commands/global` : `${process.env.NEXT_PUBLIC_BROWSER_API}/commands/global`

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
