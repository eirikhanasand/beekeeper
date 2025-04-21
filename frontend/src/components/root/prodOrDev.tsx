import Link from "next/link"
import Pulse from "../pulse"
import { ServiceStatus } from "@/interfaces"
import getSegmentedPathname from "@/utils/pathname"
import getLogs from "@/utils/fetch/log/get"

type ServicesProps = {
    services: ServiceAsList[]
    path: string
}

export default async function ProdOrDev({ services, path }: ServicesProps) {
    const segmentedPathname = getSegmentedPathname(path)
    const localLog = await getLogs('server', 'local')
    const context = segmentedPathname[1] !== 'message' ? segmentedPathname[1] : 'prod'
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
                    localLog={localLog}
                />
            )}
        </div>
    )
}

function Service({ context, service, segmentedPathname, localLog }: ServiceProps) {
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

    const logIncludesError = localLog.filter((log) => log.status === 'down' || log.status === 'degraded')
    const serviceLogIncludesError = logIncludesError.filter((log) => service.name === log.namespace)
    const downplayedStatus = service.service_status === 'operational' 
        ? serviceLogIncludesError.length > 0 
            ? 'degraded' : 'operational'
            : service.service_status

    return (
        <Link
            href={`/service/${context}/${service.name}`}
            className={serviceStyle}
        >
            <h1>{service.name}</h1>
            <Pulse status={downplayedStatus as ServiceStatus} />
        </Link>
    )
}
