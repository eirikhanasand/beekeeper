import { headers } from "next/headers"
import LogClient from "./logClient"
import getSegmentedPathname from "@/utils/pathname"

type LogsProps = {
    logs: (LocalLog | GlobalLog)[]
    pages: number
}

export default async function Logs({ logs, pages }: LogsProps) {
    const Headers = await headers()
    const path = Headers.get('x-current-path') || ''
    const segmentedPathname = getSegmentedPathname(path)
    const context = segmentedPathname[1] || 'prod'
    const namespace = segmentedPathname[2] || ''

    return (
        <div className='w-full flex-1 overflow-auto mb-2 flex flex-col h-full bg-darker rounded-xl px-2 pb-2 pt-1'>
            <LogClient logs={logs} pages={pages} namespace={namespace} context={context} />
        </div>
    )
}
