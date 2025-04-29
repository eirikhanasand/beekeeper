import { ServiceStatus } from "@/interfaces"
import Pulse from "../root/pulse"
import podStatus from "@/utils/fetch/pod/status"

type PodProps = {
    pod: Pod
}

export default async function Pods() {
    const { pods, groups, status } = await podStatus()

    return (
        <div className="bg-light w-full rounded-lg p-2">
            <h1 className="flex justify-between items-center px-2 text-almostbright">Pods<Pulse status={status} /></h1>
            {(pods.length > 0) && <div className="h-[1px] bg-superlight w-full mb-2" />}
            <div className="grid gap-2 w-full">
                {Object.entries(groups).map(([label, pods]) => (
                    <div className="w-full p-2 bg-darker rounded-lg" key={label}>
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
    const status = pod.status === 'Running' && !pod.ready.includes('0/')
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
