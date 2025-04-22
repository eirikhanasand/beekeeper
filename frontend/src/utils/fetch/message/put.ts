export default async function putMessage(message: MessageWithoutTimestamp, token: string): Promise<{status: number, result: any}> {
    const url =  `${process.env.NEXT_PUBLIC_BROWSER_API}/messages`

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
    
        const result = await response.json()
        return { status: response.status, result}
    } catch (error) {
        console.error(error)
        return { status: 400, result: "Something went wrong."}
    }
}
