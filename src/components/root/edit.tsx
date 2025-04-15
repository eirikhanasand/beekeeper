'use client'

import { getServices } from "@/utils/fetch"
import Link from "next/link"
import { useEffect, useState } from "react"

export default function Edit() {
    const [services, setServices] = useState<ServiceAsList[]>([])
    const [error, setError] = useState('')
    const [displayServiceSelector, setDisplayServiceSelector] = useState(false)

    useEffect(() => {
        (async() => {
            const newServices = await getServices('client')

            if (typeof newServices === 'string') {
                setError(newServices)
            } else {   
                setServices(newServices)
            }
        })()
    }, [])

    function handleReview() {
        setDisplayServiceSelector(true)
    }

    function ServiceSelector() {
        return (
            <div className="w-full h-full absolute left-0 top-0 grid place-items-center bg-black bg-opacity-90 z-100" onClick={() => setDisplayServiceSelector(false)}>
                <div className="w-[35vw] h-[45vh] bg-darker rounded-xl p-8 overflow-auto noscroll">
                    <h1 className="text-xl text-center font-semibold mb-2">Edit service</h1>
                    <div className="w-full grid space-y-2">
                        {services.map((service) => (
                            <Link
                                href={`/edit/${service.id}`}
                                key={service.id}
                                className="text-lg bg-light w-full rounded-md p-2"
                            >
                                {service.id}
                            </Link>
                        ))}
                    </div>
                </div>
            </div>
        )
    }

    if (typeof services === 'string') {
        return <h1 className="hidden lg:grid w-full h-full grid place-items-center">{services}</h1>
    }

    return (
        <div className="hidden lg:grid">
            {displayServiceSelector && <ServiceSelector />}
            <div className="flex flex-rows">
                <Link 
                    onClick={handleReview} 
                    className="text-base rounded-md self-center bg-light px-2"
                    href={""}>
                        Edit
                </Link>
            </div>
            {error && <Error text={error} />}
        </div>
    )
}

function Error({text}: { text: string }) {
    const path = location.href

    if (!path.includes('service')) {
        return null
    }

    return (
        <div className="absolute bg-darker bottom-8 right-8 min-h-50 p-2 max-w-[17.6vw] rounded-xl max-h-[19.5vh] overflow-auto">
            <h1 className="text-red-500">{text}</h1>
        </div>
    )
}