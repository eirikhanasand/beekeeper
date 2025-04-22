import getSegmentedPathname from "@/utils/pathname"
import getPods from "./get"
import { headers } from "next/headers"
import { ServiceStatus } from "@/interfaces"

type PodGroup = {
    [label: string]: Pod[]
}

export default async function podStatus(Namespace?: string) {
        const allPods = await getPods('server')
        const Headers = await headers()
        const path = Headers.get('x-current-path') || ''
        const segmentedPathname = getSegmentedPathname(path)
        const context = segmentedPathname[1] || 'prod'
        const namespace = Namespace || segmentedPathname[2] || ''
        const pods = namespace !== 'global' ? allPods.filter((pod) => pod.context.includes(context) && pod.namespace === namespace) : []
        const labels = new Set()
    
        for (const pod of pods) {
            const parts = pod.name.split('-')
            if (parts.length) {
                labels.add(formattedPodName(pod.name, pod.namespace))
            }
        }
    
        const groups = groupPodsByLabel(pods, Array.from(labels) as string[])
        const status = worstPodStatus(groups)
        return { pods, groups, status }
}

function formattedPodName(name: string, namespace: string): string {
    if (!name.includes('-')) {
        return name
    }

    const initialParts = name.split('-')
    const parts = initialParts.slice(0, initialParts.length - 1)

    const valid = []

    for (const part of parts) {
        if (part !== namespace && isNaN(parseInt(part[0], 10))) {
            valid.push(`${part[0].toUpperCase()}${part.slice(1)}`)
        }
    }

    if (!valid.length) {
        return name
    }

    return valid.join(' ')
}

function groupPodsByLabel(pods: Pod[], labels: string[]): PodGroup {
    const grouped: PodGroup = {}

    for (const label of labels) {
        grouped[label] = pods.filter(pod => pod.name.includes(label.replaceAll(' ', '-').toLowerCase()))
    }

    return grouped
}

function worstPodStatus(groupedPods: PodGroup): ServiceStatus {
    let status = ServiceStatus.OPERATIONAL
    Object.values(groupedPods).forEach((group) => {
        for (const pod of group) {
            const podStatus = pod.status === 'Running' 
                ? ServiceStatus.OPERATIONAL
                : pod.restarts !== '0'
                    ? ServiceStatus.DOWN
                    : ServiceStatus.DEGRADED
            
            if (status === ServiceStatus.OPERATIONAL && (podStatus === ServiceStatus.DEGRADED || podStatus === ServiceStatus.DOWN)) {
                status = podStatus
            } else if (status === ServiceStatus.DEGRADED && podStatus === ServiceStatus.DOWN) {
                status = ServiceStatus.DOWN
            }
        }
    })

    return status
}
