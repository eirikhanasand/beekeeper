type DeleteLocalCommandProps = {
    token: string
    id: string
}

export default async function deleteLocalCommand({ token, id }: DeleteLocalCommandProps) {    
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BROWSER_API}/commands/local/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        })
    
        if (!response.ok) {
            const data = await response.json()
    
            throw Error(data.error)
        }
    
        const services = await response.json()
        return services
    } catch (error) {
        console.error(error)
        return []
    }
}
