import { ServiceStatus } from "@/interfaces"
import Pulse from "./pulse"
import { headers } from "next/headers"
import getSegmentedPathname from "@/utils/pathname"
import getContexts from "@/utils/fetch/context/get"
import runCommand from "@/utils/fetch/command/post"
import getIngress from "@/utils/fetch/ingress/get"

export default async function Ingress() {
    const Headers = await headers()
    const path = Headers.get('x-current-path') || ''
    const segmentedPathname = getSegmentedPathname(path)
    const pathContext = segmentedPathname[1]
    const contexts = (await getContexts('server')).map((context) => context.name)
    const context = contexts.find((serverContext) => serverContext.includes(pathContext)) || 'prod'
    const namespace = segmentedPathname[2] || ''
    const buttonStyle = "w-full py-1 text-start flex justify-between items-center px-2 text-almostbright cursor-pointer"
    const ingress = await getIngress('server', context, namespace)
    const status = !ingress.length ? ServiceStatus.OPERATIONAL : ServiceStatus.DOWN
    return (
        <div className="bg-light rounded-lg w-full px-2">
            <button className={buttonStyle}>Ingress<Pulse status={status} /></button>
                {(ingress.length > 0) && <div className="h-[1px] bg-superlight w-full px-2" />}
            <div className="px-2">
                {ingress.map((event, index) => <h1 className="text-superlight" key={index}>{JSON.stringify(event)}</h1>)}
            </div>
        </div>
    )
}