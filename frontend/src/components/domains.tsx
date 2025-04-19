import Link from "next/link"
import ArrowOutward from "./svg/arrowOutward"
import getSegmentedPathname from "@/utils/pathname"
import { headers } from "next/headers"
import getDomains from "@/utils/fetch/namespace/getDomains"
import Pulse from "./pulse"
import { ServiceStatus } from "@/interfaces"
import DomainsClient from "./domainsClient"

export default async function Domains() {
    const Headers = await headers()
    const path = Headers.get('x-current-path') || ''
    const segmentedPathname = getSegmentedPathname(path)
    const context = segmentedPathname[1]
    const namespace = segmentedPathname[2] || ''
    const domains = await getDomains('server', context, namespace)
    const buttonStyle = "bg-light w-full rounded-lg py-1 text-start flex justify-between items-center px-2 cursor-pointer text-almostbright"
    const domainsWithStatus = await Promise.all(domains.map(async(domain) => {
        const response = await fetch(domain.url)
        return {...domain, status: response.status}
    }))

    return (
        <div className="bg-light w-full rounded-lg py-1 text-start px-2 cursor-pointer">
            <DomainsClient domains={domainsWithStatus} />
        </div>
    )
}
