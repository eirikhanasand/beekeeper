import getSegmentedPathname from "@/utils/pathname"
import { cookies, headers } from "next/headers"
import getDomains from "@/utils/fetch/namespace/domain/get"
import DomainsClient from "./domainsClient"
import getContexts from "@/utils/fetch/context/get"

export default async function Domains() {
    const Headers = await headers()
    const Cookies = await cookies()
    const path = Headers.get('x-current-path') || ''
    const segmentedPathname = getSegmentedPathname(path)
    const pathContext = segmentedPathname[1]
    const contexts = (await getContexts('server')).map((context) => context.name)
    const context = contexts.find((serverContext) => serverContext.includes(pathContext)) || 'prod'
    const namespace = segmentedPathname[2] || ''
    const domains = await getDomains('server', context, namespace)
    const domainsWithStatus = await Promise.all(domains.map(async(domain) => {
        const fetchAbleDomain = domain.url.includes('http') 
            ? domain.url
            : domain.url.includes(',') 
                ? `https://${domain.url.split(',')[0]}`
                : `https://${domain.url}`
        const response = await fetch(fetchAbleDomain)
        return {...domain, status: response.status}
    }))
    const domain = Cookies.get('domain')?.value || ""
    const domainURL = Cookies.get('domainURL')?.value || ""

    return (
        <div className="bg-light w-full rounded-lg py-1 text-start px-2 cursor-pointer">
            <DomainsClient 
                context={context}
                namespace={namespace} 
                domains={domainsWithStatus} 
                domain={domain}
                domainURL={domainURL}
            />
        </div>
    )
}
