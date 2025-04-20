export default async function postDomain(domain: DomainWithoutID): Promise<{status: number, message: any}> {
    const url =  `${process.env.NEXT_PUBLIC_BROWSER_API}/namespaces/domains`

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
    
        const message = await response.json()
        return {status: 200, message}
    } catch (error) {
        console.error(error)
        return { status: 500, message: "Something went wrong." }
    }
}
