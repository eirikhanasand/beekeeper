import { ServiceStatus } from "@/interfaces"
import getNamespaces from "@/utils/fetch/namespace/get"
import serviceStatus from './serviceStatus'

type WorstAndBestServiceStatus = {
    best: ServiceStatus
    worst: ServiceStatus
    meta: ServiceStatus
}

const priority: Record<ServiceStatus, number> = {
    [ServiceStatus.DOWN]: 3,
    [ServiceStatus.DEGRADED]: 2,
    [ServiceStatus.INACTIVE]: 1,
    [ServiceStatus.OPERATIONAL]: 0,
}

export default async function worstAndBestServiceStatus(context: string, skipDomains?: boolean): Promise<WorstAndBestServiceStatus> {
    let best = ServiceStatus.OPERATIONAL
    let worst = ServiceStatus.OPERATIONAL
    let upCount = 0
    let downCount = 0
    const services = await getNamespaces('server')
    const filteredServices = services.filter(service => {
        return service.context.includes(context)
    })

    for (const service of filteredServices) {
        const status = await serviceStatus(context, 'server', service, skipDomains)
        if (priority[status] > priority[worst]) {
            worst = status
        }

        if (status === ServiceStatus.DOWN || status === ServiceStatus.DEGRADED) {
            downCount++
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
