'use client'

import { useState } from "react"

type MonitoredCommandsProps = {
    globalCommands: GlobalCommand[]
    localCommands: LocalCommand[]
}

type GlobalCommandProps = {
    command: GlobalCommand
}

type LocalCommandProps = {
    command: LocalCommand
}

export default function MonitoredCommands({globalCommands, localCommands}: MonitoredCommandsProps) {
    const [active, setActive] = useState(false)

    if (active) {
        return (
            <div className="w-full h-[50vh] max-h-[50vh] bg-darker rounded-xl p-2">
                <div className="w-full h-full overflow-auto mb-2 noscroll text-foreground">
                    <h1 
                        onClick={() => setActive(false)} 
                        className="w-full overflow-auto mb-2 noscroll grid place-items-center text-almostbright cursor-pointer bg-normal rounded-lg py-1"
                    >
                        ↓ Monitored commands ↓
                    </h1>
                    <h1 className="text-almostbright">Global commands</h1>
                    <div className="grid gap-2 mb-2">
                        {globalCommands.map((command) => <GlobalCommand 
                            key={command.id}
                            command={command}
                        />)}
                    </div>
                    <h1 className="text-almostbright">Local commands</h1>
                    {localCommands.length > 0 ? <div>
                        {localCommands.map((command) => <LocalCommand 
                            key={command.id} 
                            command={command}
                        />)}
                    </div> : <h1 className="text-superlight">There are no local commands monitored specifically for this service.</h1>}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-[4.7vh] max-h-[4.7vh] bg-darker rounded-xl pt-1 px-2 pb-2">
            <h1 
                onClick={() => setActive(true)} 
                className="w-full h-full overflow-auto mb-2 noscroll grid place-items-center text-almostbright cursor-pointer"
            >
                ↑ Monitored commands ↑
            </h1>
        </div>
    )
}

function GlobalCommand({command}: GlobalCommandProps) {
    return (
        <div className="p-2 bg-light rounded-lg">
            <div className="flex justify-between">
                <div className="flex gap-2">
                    <h1 className="min-w-[1rem] text-superlight text-sm">{command.id}</h1>
                    <h1 className="min-w-[6rem] text-sm">{command.name}</h1>
                </div>
                <div className="flex flex-col grid place-items-end">
                    <div className="flex items-center gap-2">
                        <h1 className="text-sm text-superlight">{command.reason}</h1>
                        <h1 className="text-superlight text-sm">{new Date(command.timestamp).toLocaleString('no-NO')}</h1>
                        {/* disable funksjon senere? puls for aktiv eller ikke? */}
                        {/* <Pulse
                            innerWidth="w-2" 
                            innerHeight="h-2"
                            active={false}
                            status={log.status as ServiceStatus}
                            /> */}
                    </div>
                </div>
            </div>
            <div className="ml-[1rem] pl-2 flex justify-between">
                <div className="max-w-[84%]">
                    <h1 className="text-sm text-almostbright">{command.command}</h1>
                </div>
                <h1 className="text-superlight max-w-[16%] text-sm">{command.author}</h1>
            </div >
        </div>
    )
}

function LocalCommand({command}: LocalCommandProps) {
    return (
        <div className="p-2 bg-light rounded-lg">
            <div className="flex justify-between">
                <div className="flex gap-2">
                    <h1 className="min-w-[1rem] text-superlight text-sm">{command.id}</h1>
                    <h1 className="min-w-[6rem] text-sm">{command.name}</h1>
                </div>
                <div className="flex flex-col grid place-items-end">
                    <div className="flex items-center gap-2">
                        <h1 className="text-sm text-superlight">{command.reason}</h1>
                        <h1 className="text-superlight text-sm">{new Date(command.timestamp).toLocaleString('no-NO')}</h1>
                        {/* disable funksjon senere? puls for aktiv eller ikke? */}
                        {/* <Pulse
                            innerWidth="w-2" 
                            innerHeight="h-2"
                            active={false}
                            status={log.status as ServiceStatus}
                            /> */}
                    </div>
                    <h1 className="text-superlight text-sm">beekeeper - infra-prod-cluster | {command.author}</h1>
                </div>
            </div>
            <div className="ml-[1rem] pl-2 flex justify-between">
                <div className="max-w-[84%]">
                    <h1 className="text-sm text-almostbright">{command.command}</h1>
                </div>
            </div >
        </div>
    )
}
