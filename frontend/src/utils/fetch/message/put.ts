export default async function putMessage(message: MessageWithoutTimestamp, token: string): Promise<Result> {
    const url = `${process.env.NEXT_PUBLIC_BROWSER_API}/messages`

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
            throw Error(data)
        }

        const { message: responseMessage } = await response.json()
        return { status: response.status, message: responseMessage }
    } catch (error) {
        console.error(error)
        return { status: 400, message: "Something went wrong." }
    }
}
