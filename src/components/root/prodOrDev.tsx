'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

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

    return (
        <div className="h-full">
            <div className="h-full bg-darker rounded-xl">
                <div className="pt-[0.5rem] overflow-auto grow noscroll">
                    {services.map(service =>
                        <Service key={service.id} service={service} currentPath={path} />
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
            href={`/service/${service.id}`}
            className={`flex flex-row px-[1rem] items-center gap-[0.5rem] py-[0.8rem] hover:pl-[1.5rem] duration-[500ms] transition-[padding] ${currentService === service.id ? '*:fill-login text-login pl-[1.2rem] border-l-[0.3rem]' : ''} hover:*:fill-login hover:text-login font-medium`}
        >
            <h1>{service.id}</h1>
        </Link>
    )
}
