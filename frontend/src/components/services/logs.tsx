import { headers } from "next/headers"
import LogClient from "./logClient"
import getSegmentedPathname from "@/utils/pathname"

type LogsProps = {
    logs: (LocalLog | GlobalLog)[]
}

export default async function Logs({logs}: LogsProps) {
    const Headers = await headers()
    const path = Headers.get('x-current-path') || ''
    const segmentedPathname = getSegmentedPathname(path)
    const namespace = segmentedPathname[2] || ''
    return (
        <div className={`w-full h-full bg-darker rounded-xl px-2 pb-2 pt-1`}>
            <LogClient logs={logs} namespace={namespace} />
        </div>
    )
}
