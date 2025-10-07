import config from "@/constants"
import debug from '@/utils/debug'

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default async function getAuthor(location: 'server' | 'client', email: string): Promise<User | null> {
    const url = location === 'server' ? `${config.url.API}/user/${email}` : `${API_URL}/user/${email}`

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
        debug({ basic: error })
        return null
    }
}
