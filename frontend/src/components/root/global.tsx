import Link from "next/link"
import Pulse from "./pulse"
import getSegmentedPathname from "@/utils/pathname"
import { headers } from "next/headers"
import worstAndBestServiceStatus from "../services/worstAndBestServiceStatus"

export default async function Global() {
    const Headers = await headers()
    const path = Headers.get('x-current-path') || ''
    const segmentedPathname = getSegmentedPathname(path)
    const context = segmentedPathname[1] || 'prod'
    const isGlobal = path.includes('global')
    const { meta } = await worstAndBestServiceStatus()

    return (
        <Link 
            href={`/service/${context}/global`} 
            className={`rounded-md self-center ${isGlobal ? 'bg-normal text-almostbright cursor-not-allowed' : 'bg-light text-foreground cursor-pointer'} px-2 w-full flex justify-between items-center`}
        >
            Global
            <Pulse 
                innerWidth="w-2" 
                innerHeight="h-2"
                outerWidth="w-2.5"
                outerHeight="h-2.5"
                status={meta}
            />
        </Link>
    )
}
