export default async function postIncident(incident: IncidentWithoutID): Promise<{status: number, message: any}> {
    const url =  `${process.env.NEXT_PUBLIC_BROWSER_API}/namespaces/incidents`

    try {
        console.log("posting", incident)
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(incident)
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
