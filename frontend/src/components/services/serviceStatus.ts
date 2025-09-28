import config from '@/constants'
import { ServiceStatus } from "@/interfaces"
import getContexts from '@/utils/fetch/context/get'
import fetchDomainStatus from '@/utils/fetch/domainStatus'
import getLogs from '@/utils/fetch/log/get'
import getDomains from '@/utils/fetch/namespace/domain/get'
import podStatus from "@/utils/fetch/pod/status"

export const statusPriority: Record<string, number> = {
    [ServiceStatus.DOWN]: 3,
    [ServiceStatus.DEGRADED]: 2,
    [ServiceStatus.INACTIVE]: 1,
    [ServiceStatus.OPERATIONAL]: 0,
}

export default async function serviceStatus(context: string, location: 'server' | 'client', service: ServiceAsList, skipDomains?: boolean) {
    const response = await getLogs({
        location,
        path: 'local', 
        page: 1,
        context: context,
        namespace: service.name
    })

    const relevantLogs = response.results || []
    const uniqueLogsByCommand = new Map()
    relevantLogs.toReversed().forEach((log) => {
        uniqueLogsByCommand.set(log.command, log)
    })

    let worstStatus = ServiceStatus.OPERATIONAL
    let worstPriority = statusPriority[worstStatus]

    uniqueLogsByCommand.forEach((log: LocalLog) => {
        const logPriority = statusPriority[log.status] || 1
        if (logPriority > worstPriority) {
            worstStatus = log.status
            worstPriority = logPriority
        }
    })

    if (location === 'server' && !skipDomains) {
        const contexts = await getContexts(location)
        const ctx = contexts.find((ctx) => ctx.name.includes(context))?.name || config.DEFAULT_CLUSTER
        const domains = await getDomains(location, ctx, service.name)
        const domainsWithStatus: DomainsWithStatus[] = await Promise.all(domains.map(fetchDomainStatus))
        let down = 0
        domainsWithStatus.forEach((domain) => {
            if (domain.status < 200 || domain.status >= 300) {
                const logPriority = statusPriority.down
                down ++
                if (logPriority > worstPriority) {
                    worstStatus = ServiceStatus.DEGRADED
                    worstPriority = logPriority
                }
            }
        })

        if (down === domainsWithStatus.length && domainsWithStatus.length > 0) {
            worstStatus = ServiceStatus.DOWN
        }
    }

    const downplayedStatus = service.service_status === ServiceStatus.OPERATIONAL
        ? worstStatus !== ServiceStatus.OPERATIONAL
            ? worstStatus : ServiceStatus.OPERATIONAL
        : service.service_status

    const { status } = await podStatus(service.name)
    const serviceStatusIncludingPodStatus = downplayedStatus === ServiceStatus.OPERATIONAL
        ? status === ServiceStatus.OPERATIONAL
            ? ServiceStatus.OPERATIONAL
            : status
        : downplayedStatus === ServiceStatus.DEGRADED && (status === ServiceStatus.DEGRADED || status === ServiceStatus.OPERATIONAL)
            ? ServiceStatus.DEGRADED
            : ServiceStatus.DOWN

    return serviceStatusIncludingPodStatus
}
