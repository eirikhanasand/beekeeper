import { ServiceStatus } from "@/interfaces"
import podStatus from "@/utils/fetch/pod/status"

const statusPriority: Record<string, number> = {
    'down': 3,
    'degraded': 2,
    'inactive': 1,
    'operational': 0,
}

export default async function serviceStatus(localLog: LocalLog[], service: ServiceAsList) {
    const relevantLogs = localLog.filter((log) => log.namespace === service.name)
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

    const downplayedStatus = service.service_status === ServiceStatus.OPERATIONAL
        ? worstStatus !== ServiceStatus.OPERATIONAL
            ? worstStatus : ServiceStatus.OPERATIONAL
            : service.service_status

    const { status } = await podStatus(service.name)

    const serviceStatusIncludingPodStatus = downplayedStatus === ServiceStatus.OPERATIONAL
        ? status === ServiceStatus.OPERATIONAL
            ? ServiceStatus.OPERATIONAL
            : status
        : downplayedStatus === ServiceStatus.DEGRADED && status === ServiceStatus.DEGRADED 
            ? ServiceStatus.DEGRADED
            : ServiceStatus.DOWN

    return serviceStatusIncludingPodStatus
}
