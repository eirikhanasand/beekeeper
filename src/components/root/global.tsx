import Link from "next/link"
import Pulse from "../pulse"
import { ServiceStatus } from "@parent/interfaces"
import getLogs from "@/utils/fetch/getLogs"

export default async function Global() {
    const logs = await getLogs('server', 'global')
    const isDegraded = logs.find((log) => log.status !== 'operational')

    return (
        <Link href="/service/global" className="text-foreground rounded-md self-center bg-light px-2 w-full flex justify-between items-center">
            Global
            <Pulse 
                innerWidth="w-2" 
                innerHeight="h-2"
                outerWidth="w-2.5"
                outerHeight="h-2.5"
                status={isDegraded ? ServiceStatus.DEGRADED : ServiceStatus.OPERATIONAL}
            />
        </Link>
    )
}
