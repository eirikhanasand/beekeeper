import debug from "@/utils/debug"

export default async function putMessage(message: MessageWithoutTimestamp, token: string): Promise<Result> {
    const url = `${process.env.NEXT_PUBLIC_BROWSER_API}/messages`

    debug({
        basic: `Updating message with ${url}`,
        detailed: `Updating message with content ${message} to ${url}`,
        full: `Updating message with content ${message} to ${url} using token ${token}`
    })

    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(message)
        })

        if (!response.ok) {
            const data = await response.text()
            debug({ detailed: { message: `PUT Request to ${url} failed.`, data } })
            throw Error(data)
        }

        const { message: data } = await response.json()
        debug({ detailed: { message: `Request to ${url} succeeded`, data } })
        return { status: response.status, message: data }
    } catch (error) {
        console.error(error)
        return { status: 400, message: "Something went wrong." }
    }
}
