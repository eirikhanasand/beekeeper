import Link from "next/link"
import Pulse from "../pulse"
import { ServiceStatus } from "@parent/interfaces"
import getLogs from "@/utils/fetch/get/getLogs"
import getSegmentedPathname from "@/utils/fetch/get/pathname"
import { headers } from "next/headers"

export default async function Global() {
    const Headers = await headers()
    const path = Headers.get('x-current-path') || ''
    const segmentedPathname = getSegmentedPathname(path)
    const logs = await getLogs('server', 'global')
    const isDegraded = logs.find((log) => log.status !== 'operational')
    const context = segmentedPathname[1] || 'prod'
    const isGlobal = path.includes('global')

    return (
        <Link 
            href={`/service/${context}/global`} 
            className={`rounded-md self-center ${isGlobal ? 'bg-normal text-almostbright cursor-not-allowed' : 'bg-light text-foreground cursor-pointer'} px-2 w-full flex justify-between items-center`}
        >
            Global
            <Pulse 
                innerWidth="w-2" 
                innerHeight="h-2"
                outerWidth="w-2.5"
                outerHeight="h-2.5"
                status={isDegraded ? ServiceStatus.DEGRADED : ServiceStatus.OPERATIONAL}
            />
        </Link>
    )
}
