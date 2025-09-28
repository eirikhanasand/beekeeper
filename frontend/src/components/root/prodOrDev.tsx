import Link from "next/link"
import Pulse from "./pulse"
import getSegmentedPathname from "@/utils/pathname"
import serviceStatus from "../services/serviceStatus"

type ServicesProps = {
    services: ServiceAsList[]
    path: string
}

export default async function ProdOrDev({ services, path }: ServicesProps) {
    const segmentedPathname = getSegmentedPathname(path)
    const context = segmentedPathname[1] && segmentedPathname[1] !== 'message' ? segmentedPathname[1] : 'prod'
    const filteredServices = services.filter(service => {
        return service.context.includes(context)
    })

    return (
        <div className="h-full w-full bg-darker rounded-xl overflow-auto max-h-full noscroll">
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

async function Service({ context, service, segmentedPathname }: ServiceProps) {
    const currentService = segmentedPathname.includes("service") 
        ? segmentedPathname[2]
        : ''

    const serviceStyle = `
        flex flex-row px-[1rem] items-center gap-[0.5rem] py-[0.8rem] 
        hover:pl-[1.5rem] duration-[500ms] transition-[padding] 
        ${currentService === service.name 
            ? '*:fill-login text-login pl-[1.2rem] border-l-[0.3rem]' 
            : ''
        } hover:*:fill-login hover:text-login font-medium justify-between
    `

    const status = await serviceStatus(context, 'server', service)

    return (
        <Link
            href={`/service/${context}/${service.name}`}
            className={serviceStyle}
        >
            <h1>{service.name}</h1>
            <Pulse status={status} />
        </Link>
    )
}

