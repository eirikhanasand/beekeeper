import { ServiceStatus } from "@/interfaces"
import podStatus from "@/utils/fetch/pod/status"

export default async function serviceStatus(localLog: LocalLog[], service: ServiceAsList) {
    const logIncludesError = localLog.filter((log) => log.status === 'down' || log.status === 'degraded')
    const serviceLogIncludesError = logIncludesError.filter((log) => service.name === log.namespace)
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

    return serviceStatusIncludingPodStatus
}
