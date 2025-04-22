import getSegmentedPathname from "@/utils/pathname"
import { cookies, headers } from "next/headers"
import getIncidents from "@/utils/fetch/namespace/incident/get"
import IncidentsClient from "./incidentsClient"
import getContexts from "@/utils/fetch/context/get"

export default async function Incidents() {
    const Headers = await headers()
    const Cookies = await cookies()
    const path = Headers.get('x-current-path') || ''
    const segmentedPathname = getSegmentedPathname(path)
    const pathContext = segmentedPathname[1]
    const contexts = (await getContexts('server')).map((context) => context.name)
    const context = contexts.find((serverContext) => serverContext.includes(pathContext)) || 'prod'
    const namespace = segmentedPathname[2] || ''
    const incidents = await getIncidents('server', context, namespace)
    const incident = Cookies.get('incident')?.value || ""
    const incidentURL = Cookies.get('incidentURL')?.value || ""
    const incidentTimestamp = Cookies.get('incidentTimestamp')?.value || ""
    return (
        <div className="bg-light w-full rounded-lg py-1 text-start px-2 cursor-pointer">
            <IncidentsClient
                context={context}
                namespace={namespace} 
                incidents={incidents} 
                incident={incident}
                incidentURL={incidentURL}
                incidentTimestamp={incidentTimestamp}
            />
        </div>
    )
}