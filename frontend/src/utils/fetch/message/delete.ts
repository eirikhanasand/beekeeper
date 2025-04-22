export default async function deleteMessage(id: string, token: string): Promise<number> {
    const url =  `${process.env.NEXT_PUBLIC_BROWSER_API}/messages/${id}`

    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })
        
        if (!response.ok) {
            const data = await response.text()
            throw Error(data)
        }
    
        return response.status
    } catch (error) {
        console.error(error)
        return 400
    }
}
