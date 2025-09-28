import getSegmentedPathname from "@/utils/pathname"
import { headers } from "next/headers"
import getDomains from "@/utils/fetch/namespace/domain/get"
import DomainsClient from "./domainsClient"
import getContexts from "@/utils/fetch/context/get"

export default async function Domains() {
    const Headers = await headers()
    const path = Headers.get('x-current-path') || ''
    const segmentedPathname = getSegmentedPathname(path)
    const pathContext = segmentedPathname[1]
    const contexts = (await getContexts('server')).map((context) => context.name)
    const context = contexts.find((serverContext) => serverContext.includes(pathContext)) || 'prod'
    const namespace = segmentedPathname[2] || ''
    const domains = await getDomains('server', context, namespace)

    if (!domains.length) {
        return <></>
    }

    return (
        <div className="bg-light w-full rounded-lg py-1 text-start px-2 cursor-pointer">
            <DomainsClient namespace={namespace} domains={domains} />
        </div>
    )
}
