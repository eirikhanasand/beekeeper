import { ServiceStatus } from "@parent/interfaces"
import Pulse from "../pulse"

type LogProps = {
    log: Log
}

export default function Log({log}: LogProps) {
    return (
        <div className="p-2 bg-light rounded-lg">
            <div className="flex justify-between">
                <div className="flex gap-2">
                    <h1 className="min-w-[1rem] text-superlight text-sm">{log.id}</h1>
                    <h1 className="w-[15rem] text-sm">{log.name}</h1>
                </div>
                <div className="flex items-center">
                    <h1 className="text-sm mr-2 text-superlight">{log.command}</h1>
                    <h1 className="text-superlight text-sm mr-1.5">{new Date(log.timestamp).toLocaleString('no-NO')}</h1>
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
