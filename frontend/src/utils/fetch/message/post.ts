import debug from "@/utils/debug"

type PostMessageProps = {
    message: BaseMessage
    token: string
}

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default async function postMessage({message, token}: PostMessageProps): Promise<Result> {
    const url = `${API_URL}/messages`

    debug({
        basic: `Posting message to ${url}`,
        detailed: `Posting message with content ${message} to ${url}`,
        full: `Posting message with content ${message} to ${url} using token ${token}`
    })

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message)
        })

        if (!response.ok) {
            const data = await response.text()
            debug({ detailed: { message: `POST Request to ${url} failed`, data } })
            throw Error(data)
        }

        const { message: responseMessage } = await response.json()
        debug({ detailed: { message: `Request to ${url} succeeded with data`, data: responseMessage } })
        return { status: response.status, message: responseMessage }
    } catch (error) {
        debug({
            production: { message: `Request to ${url} failed with error`, error }
        })

        return { status: 400, message: "Something went wrong." }
    }
}
