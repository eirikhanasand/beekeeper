import { ServiceStatus } from "@/interfaces"
import getLogs from "@/utils/fetch/log/get"
import getNamespaces from "@/utils/fetch/namespace/get"
import podStatus from "@/utils/fetch/pod/status"
import getSegmentedPathname from "@/utils/pathname"
import { headers } from "next/headers"

export default async function worstAndBestServiceStatus(): Promise<{ best: ServiceStatus, worst: ServiceStatus, meta: ServiceStatus }> {
    let best = ServiceStatus.OPERATIONAL
    let worst = ServiceStatus.OPERATIONAL
    let upCount = 0
    let downCount = 0
    const Headers = await headers()
    const path = Headers.get('x-current-path') || ''
    const segmentedPathname = getSegmentedPathname(path)
    const response = await getLogs('server', 'local', 1)
    const logs = response.results as LocalLog[]
    const context = segmentedPathname[1] && segmentedPathname[1] !== 'message' ? segmentedPathname[1] : 'prod'
    const services = await getNamespaces('server')
    const filteredServices = services.filter(service => {
        return service.context.includes(context)
    })

    for (const service of filteredServices) {
        const logIncludesError = logs.filter((log) => log.status === 'down' || log.status === 'degraded')
        const serviceLogIncludesError = logIncludesError.filter((log) => service.name === ('namespace' in log ? log.namespace : ''))
        const downplayedStatus = service.service_status === ServiceStatus.OPERATIONAL
            ? serviceLogIncludesError.length > 0
                ? ServiceStatus.DEGRADED : ServiceStatus.OPERATIONAL
            : service.service_status

        const { status } = await podStatus(service.name)

        const serviceStatusIncludingPodStatus = downplayedStatus === ServiceStatus.OPERATIONAL
            ? status === ServiceStatus.OPERATIONAL
                ? ServiceStatus.OPERATIONAL
                : status
            : downplayedStatus === ServiceStatus.DEGRADED && status === ServiceStatus.DEGRADED
                ? ServiceStatus.DEGRADED
                : ServiceStatus.DOWN

        if (worst === ServiceStatus.OPERATIONAL && serviceStatusIncludingPodStatus === ServiceStatus.DEGRADED) {
            worst = ServiceStatus.DEGRADED
        } else if (worst === ServiceStatus.OPERATIONAL && serviceStatusIncludingPodStatus === ServiceStatus.DOWN) {
            worst = ServiceStatus.DOWN
            downCount++
        } else if (worst === ServiceStatus.DEGRADED) {
            if (serviceStatusIncludingPodStatus === ServiceStatus.DOWN) {
                worst = ServiceStatus.DOWN
                downCount++
            }
        } else {
            upCount++
        }
    }

    const allDown = downCount === filteredServices.length
    const someDown = upCount !== filteredServices.length
    let meta = ServiceStatus.OPERATIONAL

    if (someDown) {
        meta = ServiceStatus.DEGRADED
    }

    if (allDown) {
        meta = ServiceStatus.DOWN
    }

    return { best, worst, meta }
}
