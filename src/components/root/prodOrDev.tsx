'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import Pulse from "../pulse"
import { ServiceStatus } from "@parent/interfaces"

type ServicesProps = {
    services: ServiceAsList[]
    currentPath: string
}

export default function ProdOrDev({ services }: ServicesProps) {
    const path = usePathname()
    const [dev, setDev] = useState(path.includes('dev'))

    useEffect(() => {
        setDev(path.includes('dev'))
    }, [path])

    const filteredServices = services.filter(service => {
        if (dev) {
            return service.context.includes('internal-test')
        } else {
            return service.context.includes('infra-prod-cluster')
        }
    })

    return (
        <div className="h-full">
            <div className="h-full bg-darker rounded-xl">
                <div className="overflow-auto max-h-[77vh] noscroll">
                    {filteredServices.map(service =>
                        <Service key={service.name} service={service} currentPath={path} />
                    )}
                </div>
            </div>
        </div>
    )
}

function Service({ service, currentPath }: ServiceProps) {
    const currentService = currentPath.includes("/service/") ? currentPath.split("/service/")[1].split("/")[0] : ''
    return (
        <Link
            href={`/service/${service.name}`}
            className={`flex flex-row px-[1rem] items-center gap-[0.5rem] py-[0.8rem] hover:pl-[1.5rem] duration-[500ms] transition-[padding] ${currentService === service.name ? '*:fill-login text-login pl-[1.2rem] border-l-[0.3rem]' : ''} hover:*:fill-login hover:text-login font-medium justify-between`}
        >
            <h1>{service.name}</h1>
            <Pulse status={service.service_status as ServiceStatus} />
        </Link>
    )
}
