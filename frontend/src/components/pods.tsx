import { ServiceStatus } from "@/interfaces"
import Pulse from "./pulse"
import getPods from "@/utils/fetch/pod/get"
import { headers } from "next/headers"
import getSegmentedPathname from "@/utils/pathname"

type PodProps = {
    pod: Pod
}

type PodGroup = {
    [label: string]: Pod[]
}

export default async function Pods() {
    const allPods = await getPods('server')
    const Headers = await headers()
    const path = Headers.get('x-current-path') || ''
    const segmentedPathname = getSegmentedPathname(path)
    const context = segmentedPathname[1] || 'prod'
    const namespace = segmentedPathname[2] || ''
    const pods = namespace !== 'global' ? allPods.filter((pod) => pod.context.includes(context) && pod.namespace === namespace) : []
    const labels = new Set()

    for (const pod of pods) {
        const parts = pod.name.split('-')
        if (parts.length) {
            labels.add(formattedPodName(pod.name, pod.namespace))
        }
    }

    const groups = groupPodsByLabel(pods, Array.from(labels) as string[])

    return (
        <div className="bg-light w-full rounded-lg py-1 px-2">
            <h1 className="flex justify-between items-center px-2 text-almostbright">Pods<Pulse status={ServiceStatus.OPERATIONAL} /></h1>
            {(pods.length > 0) && <div className="h-[1px] bg-superlight w-full mb-2" />}
            <div className="grid gap-2 w-full">
                {Object.entries(groups).map(([label, pods]) => (
                    <div className="w-full px-2 bg-darker rounded-lg" key={label}>
                        <h1 className="text-almostbright text-sm">{label}</h1>
                        {pods.map((pod, index) => (
                            <div key={pod.name} className="w-full">
                                <Pod pod={pod} />
                                {index === pods.length - 1 ? '' : <div className="w-full h-[1px] bg-superlight" />}
                            </div>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    )
}

function Pod({pod}: PodProps) {
    const status = pod.status === 'Running' 
        ? ServiceStatus.OPERATIONAL
        : pod.restarts !== '0'
            ? ServiceStatus.DOWN
            : ServiceStatus.DEGRADED

    return (
        <div>
            <h1 className="text-superlight text-[0.8rem] flex justify-between items-center">{pod.name}<Pulse status={status} /></h1>
            <div className="flex gap-2">
                <h1 className="text-extralight text-[0.8rem]">Ready: {pod.ready}</h1>
                <h1 className="text-extralight text-[0.8rem]">Restarts: {pod.restarts}</h1>
                <h1 className="text-extralight text-[0.8rem]">Age: {pod.age}</h1>
            </div>
        </div>
    )
}

function groupPodsByLabel(pods: Pod[], labels: string[]): PodGroup {
    const grouped: PodGroup = {}

    for (const label of labels) {
        grouped[label] = pods.filter(pod => pod.name.includes(label.replaceAll(' ', '-').toLowerCase()))
    }

    return grouped
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
