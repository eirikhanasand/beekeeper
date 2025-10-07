import config from "@/constants"
import debug from '@/utils/debug'

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default async function getGlobalCommands(location: 'server' | 'client'): Promise<GlobalCommand[]> {
    const url = location === 'server' ? `${config.url.API}/commands/global` : `${API_URL}/commands/global`

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
        return commands
    } catch (error) {
        debug({ basic: error })
        return []
    }
}
