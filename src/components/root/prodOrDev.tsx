import Link from "next/link"
import Pulse from "../pulse"
import { ServiceStatus } from "@parent/interfaces"
import getSegmentedPathname from "@/utils/fetch/pathname"

type ServicesProps = {
    services: ServiceAsList[]
    path: string
}

export default async function ProdOrDev({ services, path }: ServicesProps) {
    const segmentedPathname = getSegmentedPathname(path)
    const context = segmentedPathname[1] || 'prod'
    const filteredServices = services.filter(service => {
        return service.context.includes(context)
    })

    return (
        <div className="h-full bg-darker rounded-xl overflow-auto max-h-full noscroll">
            {filteredServices.map(service =>
                <Service 
                    key={service.name} 
                    service={service} 
                    segmentedPathname={segmentedPathname}
                    context={context}
                />
            )}
        </div>
    )
}

function Service({ context, service, segmentedPathname }: ServiceProps) {
    const currentService = segmentedPathname.includes("service") 
        ? segmentedPathname[(segmentedPathname.indexOf("service"))]
        : ''
    return (
        <Link
            href={`/service/${context}/${service.name}`}
            className={`flex flex-row px-[1rem] items-center gap-[0.5rem] py-[0.8rem] hover:pl-[1.5rem] duration-[500ms] transition-[padding] ${currentService === service.name ? '*:fill-login text-login pl-[1.2rem] border-l-[0.3rem]' : ''} hover:*:fill-login hover:text-login font-medium justify-between`}
        >
            <h1>{service.name}</h1>
            <Pulse status={service.service_status as ServiceStatus} />
        </Link>
    )
}
