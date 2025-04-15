'use client'

import { getServices } from "@utils/fetch"
import ToolTipsButton from "./toolTipsButton"
import Header from "./header"
import StudyOrTest from "./prodOrDev"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function ServiceListClient() {
    const [services, setServices] = useState<ServiceAsList[] | string>("Loading...")
    const path = usePathname()

    useEffect(() => {
        (async() => {
            const response = await getServices('server')

            if (response) {
                setServices(response)
            }
        })()
    }, [])

    if (typeof services === 'string') {
        return <h1 className="w-full h-full grid place-items-center">{services}</h1>
    }

    return (
        <div className='w-full h-full grid grid-rows-12 noscroll'>
            <div className="row-span-11 bg-darker mb-2 py-2">
                <div className="h-full px-2 noscroll">
                    <Header />
                    <StudyOrTest services={services} currentPath={path} />
                </div>
            </div>
            <ToolTipsButton />
        </div>
    )
}