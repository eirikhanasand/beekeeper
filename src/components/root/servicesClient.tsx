'use client'

import getNamespaces from "@utils/fetch/getNamespaces"
import ToolTipsButton from "./toolTipsButton"
import Header from "./header"
import ProdOrDev from "./prodOrDev"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

export default function ServiceListClient() {
    const [services, setServices] = useState<ServiceAsList[]>([])
    const path = usePathname()

    useEffect(() => {
        (async() => {
            const response = await getNamespaces('server')

            if (response) {
                setServices(response)
            }
        })()
    }, [])

    return (
        <div className='w-full h-full grid grid-rows-12 noscroll'>
            <div className="row-span-11 bg-darker mb-2 py-2">
                <div className="h-full px-2 noscroll">
                    <Header />
                    <ProdOrDev services={services} currentPath={path} />
                </div>
            </div>
            <ToolTipsButton />
        </div>
    )
}