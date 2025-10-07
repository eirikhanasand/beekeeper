import debug from '@/utils/debug'

type DeleteGlobalCommandProps = {
    token: string
    id: string
}

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default async function deleteGlobalCommand({ token, id }: DeleteGlobalCommandProps) {
    try {
        const response = await fetch(`${API_URL}/commands/global/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })

        if (!response.ok) {
            const data = await response.json()

            throw Error(data.error)
        }

        const services = await response.json()
        return services
    } catch (error) {
        debug({ basic: error })
        return []
    }
}
