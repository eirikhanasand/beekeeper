'use client'

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Pulse from "../root/pulse"
import { ServiceStatus } from "@/interfaces"
import { usePathname } from "next/navigation"

type DomainsClientProps = {
    namespace: string
    domains: Domain[]
}

export default function DomainsClient({ namespace, domains: Domains }: DomainsClientProps) {
    const [domains, setDomains] = useState<DomainsWithStatus[]>([])
    const timerRef = useRef(3000)
    const [timeLeft, setTimeLeft] = useState(timerRef.current / 1000)
    const path = usePathname()
    const allowEdit = namespace !== 'global' && !path.includes('/service/message')
    const domainStatus = domains.length === 0
        ? ServiceStatus.INACTIVE
        : domains.every(domain => domain.status >= 200 && domain.status < 300)
            ? ServiceStatus.OPERATIONAL
            : domains.some(domain => domain.status >= 200 && domain.status < 300) 
                ? ServiceStatus.DEGRADED
                : ServiceStatus.DOWN

    useEffect(() => {
        const countdown = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : timerRef.current / 1000))
        }, 1000)

        return () => clearInterval(countdown)
    }, [])
    
    useEffect(() => {
        const intervalId = setInterval(async () => {
            const domainsWithStatus = await Promise.all(Domains.map(async (domain) => {
                const fetchAbleDomain = domain.url.includes('http')
                    ? domain.url
                    : domain.url.includes(',')
                        ? `https://${domain.url.split(',')[0]}`
                        : `https://${domain.url}`
                const response = await fetch(`/api/proxy?url=${fetchAbleDomain}`)
                return { ...domain, status: response.status }
            }))
            setDomains(domainsWithStatus)
        }, 3000)

        return () => clearInterval(intervalId)
    }, [])

    return (
        <div className="grid gap-2 pb-1">
            <div className="flex justify-between px-2">
                <h1 className="text-almostbright">Domain status</h1>
                <div className="flex items-center gap-2">
                    <h1 className="text-extralight">{`${timeLeft === 0 ? 'fetching' : `${timeLeft}s`}`}</h1>
                    <Pulse status={domainStatus} />
                </div>
            </div>
            {(domains.length > 0 || allowEdit) && <div className="h-[1px] bg-superlight w-full" />}
            {domains.toReversed().map((domain, index) => {
                const formattedDomain = domain.name.includes('-')
                    ? `${domain.name.split('-')[1][0].toUpperCase()}${domain.name.split('-')[1].slice(1)}`
                    : domain.name
                return (
                    <Link
                        href={domain.url}
                        key={index}
                        className="bg-darker w-full rounded-lg cursor-pointer text-almostbright py-1 px-2"
                    >
                        <div className='flex justify-between items-center'>
                            <h1>{formattedDomain}</h1>
                            <div className='flex gap-2 justify-center items-center'>
                                <h1 className='text-sm'>{domain.status}</h1>
                                <Pulse status={domain.status >= 200 && domain.status < 300 ? ServiceStatus.OPERATIONAL : ServiceStatus.DOWN} />
                            </div>
                        </div>
                        <h1 className="text-superlight text-xs">{domain.url}</h1>
                    </Link>
                )
            })}
        </div>
    )
}
