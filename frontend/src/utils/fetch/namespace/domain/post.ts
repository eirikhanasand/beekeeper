import debug from '@/utils/debug'

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default async function postDomain(domain: DomainWithoutID): Promise<Result> {
    const url = `${API_URL}/namespaces/domains`

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(domain)
        })

        if (!response.ok) {
            const data = await response.text()
            throw Error(data)
        }

        const { message } = await response.json()
        return { status: 200, message }
    } catch (error) {
        debug({ basic: error })
        return { status: 500, message: "Something went wrong." }
    }
}
