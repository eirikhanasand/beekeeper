import Link from "next/link"
import ArrowOutward from "./svg/arrowOutward"
import getSegmentedPathname from "@/utils/pathname"
import { headers } from "next/headers"
import getIncidents from "@/utils/fetch/namespace/getIncidents"

export default async function Incidents() {
    const Headers = await headers()
    const path = Headers.get('x-current-path') || ''
    const segmentedPathname = getSegmentedPathname(path)
    const context = segmentedPathname[1]
    const namespace = segmentedPathname[2] || ''
    const incidents = await getIncidents('server', context, namespace)
    const buttonStyle = "bg-light w-full rounded-lg py-1 text-start flex justify-between items-center px-2 cursor-pointer text-almostbright"
    return (
        <div className="bg-light w-full rounded-lg py-1 text-start px-2 cursor-pointer">
            <Link
                target="_blank"
                href="https://wiki.login.no/tekkom/projects/infrastructure/incident" 
                className={buttonStyle}>All incidents<ArrowOutward className=' w-[1rem] h-[1rem] fill-login'/>
            </Link>
            <div className="h-[1px] bg-superlight w-full" />
            {incidents.map((incident) => <Link
                key={incident.url}
                target="_blank"
                href={incident.url}
                className={buttonStyle}>{incident.name}<ArrowOutward className=' w-[1rem] h-[1rem] fill-login'/>
            </Link>)}
            <div className={`pb-2 ${!incidents.length && 'pt-2'}`}>
                <div className="flex justify-between items-center px-2 text-almostbright bg-normal rounded-lg py-1">
                    <h1>Add incident</h1>
                    <h1 className="text-lg pr-[3px] text-login">+</h1>
                </div>
            </div>
        </div>
    )
}