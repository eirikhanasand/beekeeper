import React from 'react'
import Services from '@/components/root/services'
import Logs from '@/components/services/logs'
import getLogs from '@/utils/fetch/log/get'
import Terminal from '@/components/services/terminal'
import MonitoredCommands from '@/components/services/monitoredCommands'
import getGlobalCommands from '@/utils/fetch/command/global/get'
import getLocalCommands from '@/utils/fetch/command/local/get'
import Pulse from '@/components/pulse'
import { ServiceStatus } from '@/interfaces'
import { cookies } from 'next/headers'
import getAuthor from '@/utils/fetch/user/getUser'
import Incidents from '@/components/incidents'
import Domains from '@/components/domains'
import Link from 'next/link'
import Pods from '@/components/pods'
import Ingress from '@/components/ingress'

export default async function Service({params}: {params: Promise<{ id: string[] }>}) {
    const id = (await params).id[1]
    const isGlobal = id === "global"
    const logs = await getLogs("server", isGlobal ? "global" : "local")
    const globalCommands = await Promise.all((await getGlobalCommands('server')).map(async(command) => ({
        ...command, author: await getAuthor('server', command.author) || "Unknown User"
    }))) as GlobalCommandWithUser[]
    const localCommands = await Promise.all((await getLocalCommands('server', id)).map(async(command) => ({
        ...command, author: await getAuthor('server', command.author) || "Unknown User"
    }))) as LocalCommandWithUser[]

    const filteredLogs = isGlobal ? logs : logs.filter((log) => log.command.includes(`-n ${id}`))
    const filteredGlobalCommands = isGlobal 
        ? globalCommands.filter((command) => !command.command.includes('{namespace}'))
        : globalCommands.filter((command) => command.command.includes('{namespace}'))
    const filteredLocalCommands = localCommands.filter((command) => command.command.includes(`-n ${id}`))
    const buttonStyle = "bg-light w-full rounded-lg py-1 text-start flex justify-between items-center px-2 cursor-pointer"
    const Cookies = await cookies()
    const command = Cookies.get('command')?.value || ''
    const commandName = Cookies.get('commandName')?.value || ''
    const commandReason = Cookies.get('commandReason')?.value || ''

    return (
        <div className='grid grid-cols-12 gap-2 w-full h-full max-h-full'>
            <div className='hidden rounded-xl lg:grid col-span-3 sm:col-span-2 max-h-[calc((100vh-var(--h-navbar))-1rem)]'>
                <Services />
            </div>
            <div className="col-span-10 w-full rounded-xl grid grid-cols-12 gap-2 h-full max-h-[calc((100vh-var(--h-navbar))-1rem)]">
                <div className="w-full col-span-9 max-h-full overflow-hidden flex flex-col">
                    <div className="w-full flex-shrink-0">
                        <Terminal 
                            name={commandName} 
                            reason={commandReason} 
                            namespace={id}
                            command={command}
                        />
                    </div>
                    <div className="w-full flex-1 overflow-auto flex flex-col mb-2">
                        <Logs logs={filteredLogs} />
                    </div>
                    <div className="w-full flex-shrink-0">
                        <MonitoredCommands 
                            globalCommands={filteredGlobalCommands}
                            localCommands={filteredLocalCommands}
                        />
                    </div>
                </div>
                <div className='flex flex-col w-full h-full rounded-xl col-span-3 gap-2'>
                    <div className="w-full h-full rounded-xl bg-darker p-2 overflow-auto noscroll max-h-[87vh]">
                        <div className="flex flex-col gap-2">
                            <Domains />
                            <Incidents />
                            <Pods />
                            <Ingress />
                            <h1 className='text-superlight text-center'>Below items are planned but not implemented yet.</h1>
                            <button className={buttonStyle}>Flux<Pulse status={ServiceStatus.OPERATIONAL} /></button>
                            <button className={buttonStyle}>Version status<Pulse status={ServiceStatus.OPERATIONAL} /></button>
                            <button className={buttonStyle}>Commit history</button>
                        </div>
                    </div>
                    <Link href='/service/message' className="w-full p-2 bg-darker rounded-xl flex">
                        <h1 className="px-2 bg-superlight rounded-lg grid place-items-center mr-2">S</h1>
                        <h1 className="grid place-items-center">Service Status</h1>
                    </Link>
                </div>
            </div>
        </div>
    )
}
