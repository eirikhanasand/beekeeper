import debug from "@/utils/debug"

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default async function deleteMessage(id: string, token: string): Promise<number> {
    const url = `${API_URL}/messages/${id}`

    debug({
        basic: `Deleting message with ${url}`,
        detailed: `Deleting message with id ${id} from ${url}`,
        full: `Deleting message with id ${id} from ${url} using token ${token}`
    })

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })

        if (!response.ok) {
            const data = await response.text()
            debug({ detailed: `Delete ${id} from ${url} failed with data ${JSON.stringify(data)}` })
            throw Error(data)
        }

        debug({ detailed: `Request to ${url} succeeded with data ${JSON.stringify(await response.json())}` })
        return response.status
    } catch (error) {
        debug({
            production: { message: `DELETE request for ${id} to ${url} failed with error`, error }
        })

        return 400
    }
}
