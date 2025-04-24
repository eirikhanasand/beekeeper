import { ServiceStatus } from "@/interfaces"
import Pulse from "../root/pulse"
import { headers } from "next/headers"
import getSegmentedPathname from "@/utils/pathname"
import getContexts from "@/utils/fetch/context/get"
import getIngress from "@/utils/fetch/ingress/get"
import getIngressEvents from "@/utils/fetch/ingress/events/get"
import Link from "next/link"

type IngressProps = {
    ingress: Ingress & { events: string[] }
}

export default async function Ingresses() {
    const Headers = await headers()
    const path = Headers.get('x-current-path') || ''
    const segmentedPathname = getSegmentedPathname(path)
    const pathContext = segmentedPathname[1]
    const contexts = (await getContexts('server')).map((context) => context.name)
    const context = contexts.find((serverContext) => serverContext.includes(pathContext)) || 'prod'
    const namespace = segmentedPathname[2] || ''
    const buttonStyle = "w-full py-1 text-start flex justify-between items-center px-2 text-almostbright cursor-pointer"
    const ingresses = await getIngress('server', context, namespace)
    let status = ServiceStatus.OPERATIONAL
    const ingressWithEvents = await Promise.all(ingresses.map(async(ingress) => {
        const events = await getIngressEvents({location: 'server', context, namespace, name: ingress.name})
        if (events.length) {
            status = ServiceStatus.DOWN
        }

        return { ...ingress, events }
    }))


    return (
        <div className="bg-light rounded-lg w-full px-2">
            <button className={buttonStyle}>Ingress<Pulse status={status} /></button>
                {(ingresses.length > 0) && <div className="h-[1px] bg-superlight w-full px-2" />}
            <div className="w-full grid gap-2 my-2">
                {ingressWithEvents.map((ingress, index) => <Ingress key={index} ingress={ingress} />)}
            </div>
        </div>
    )
}

async function Ingress({ingress}: IngressProps) {
    const formattedHost = ingress.hosts.includes(',') ? ingress.hosts.split(',')[0] : ingress.hosts
    return (
        <div className="w-full bg-darker rounded-lg p-2 overflow-hidden">
            <h1 className="text-superlight text-[0.8rem] flex justify-between items-center">
                {ingress.name + ' - ' + ingress.class}<Pulse status={ingress.events.length > 0 ? ServiceStatus.DOWN : ServiceStatus.OPERATIONAL} />
            </h1>
            <Link href={`https://${formattedHost}`} className="text-extralight text-[0.8rem] text-sm">{ingress.hosts}</Link>
            <div className="flex gap-2 w-full overflow-auto">
                <h1 className="text-extralight text-[0.8rem]">Address {ingress.address}</h1>
                <h1 className="text-extralight text-[0.8rem]">Ports {ingress.ports}</h1>
                <h1 className="text-extralight text-[0.8rem]">Age {ingress.age}</h1>
            </div>
        </div>
    )
}
