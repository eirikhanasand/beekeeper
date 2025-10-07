import debug from '@utils/debug'

type DeleteLocalCommandProps = {
    token: string
    id: string
}

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default async function deleteLocalCommand({ token, id }: DeleteLocalCommandProps) {
    try {
        const response = await fetch(`${API_URL}/commands/local/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        })

        if (!response.ok) {
            const data = await response.json()

            throw Error(data.error)
        }

        return response.status
    } catch (error) {
        debug({ basic: error })
        return 400
    }
}
