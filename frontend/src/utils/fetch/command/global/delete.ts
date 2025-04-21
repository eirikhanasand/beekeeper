type DeleteGlobalCommandProps = {
    token: string
    id: string
}

export default async function deleteGlobalCommand({ token, id }: DeleteGlobalCommandProps) {    
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_BROWSER_API}/commands/global/${id}`, {
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
