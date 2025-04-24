import config from "@/constants"
import debug from "@/utils/debug"

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default async function getMessages(location: 'server' | 'client'): Promise<Message[]> {
    const url = `${location === 'server' ? config.url.API : API_URL}/messages`

    debug({
        basic: `Fetching messages from ${url}`,
        detailed: `Fetching messages (${location}) from ${url}`,
    })

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

        const data = await response.json()
        debug({ detailed: { message: `Fetching messages from ${url} succeeded with data`, data } })
        return data
    } catch (error) {
        debug({ production: { message: `Failed while fetching from ${url}`, error } })
        return []
    }
}
