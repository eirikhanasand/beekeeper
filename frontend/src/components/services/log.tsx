import { ServiceStatus } from "@/interfaces"
import Pulse from "../root/pulse"

type LogProps = {
    log: LocalLog | GlobalLog
}

export default function Log({log}: LogProps) {
    return (
        <div className="p-2 bg-light rounded-lg h-fit">
            <div className="flex justify-between">
                <div className="flex gap-2">
                    <h1 className="min-w-[1rem] text-superlight text-sm">{log.id}</h1>
                    <h1 className="w-[15rem] text-sm">{log.name}</h1>
                </div>
                <div className="flex gap-2">
                    <h1 className="text-sm text-right text-superlight">{log.command}</h1>
                    <h1 className="text-right text-superlight text-sm min-w-[8.5vw]">{new Date(log.timestamp).toLocaleString('no-NO')}</h1>
                    <Pulse
                        innerWidth="w-2" 
                        innerHeight="h-2"
                        active={false}
                        status={log.status as ServiceStatus}
                    />
                </div>
            </div>
            <div className="ml-[1rem] pl-2">
                {log.event.split('\n').map((line, index) => <h1 key={index} className="text-almostbright text-sm">{line}</h1>)}
            </div>
        </div>
    )
}
