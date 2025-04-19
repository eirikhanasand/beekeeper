'use client'

import Link from "next/link"
import { useState } from "react"

type EditProps = {
    services: ServiceAsList[]
}

export default function Edit({services}: EditProps) {
    const [displayServiceSelector, setDisplayServiceSelector] = useState(false)

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
                                href={`/edit/${service.name}`}
                                key={service.name}
                                className="text-lg bg-light w-full rounded-md p-2"
                            >
                                {service.name}
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
                    className="text-base rounded-md self-center bg-light px-4"
                    href={""}>
                        Edit
                </Link>
            </div>
        </div>
    )
}
