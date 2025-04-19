import config from "@/constants"

export default async function getAuthor(location: 'server' | 'client', email: string): Promise<User | null> {
    const url = location === 'server' ? `${config.url.API}/user/${email}` : `${process.env.NEXT_PUBLIC_BROWSER_API}/user/${email}`

    try {
        const response = await fetch(url, {
            next: { revalidate: 10 },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
    
        if (!response.ok) {
            const data = await response.json()
    
            throw Error(data.error)
        }
    
        const user = await response.json()
        return user
    } catch (error) {
        console.error(error)
        return null
    }
}
