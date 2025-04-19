'use client'

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Pulse from "./pulse"
import { ServiceStatus } from "@/interfaces"

type DomainsClientProps = {
    domains: DomainsWithStatus[]
}

export default function DomainsClient({domains: Domains}: DomainsClientProps) {
    const [domains, setDomains] = useState(Domains)
    const allDomainsAreOperational = true
    const buttonStyle = "bg-light w-full rounded-lg py-1 text-start flex justify-between items-center px-2 cursor-pointer text-almostbright"
    const timerRef = useRef(3000)
    const [name, setName] = useState("")
    const [date, setDate] = useState("")
    const [url, setURL] = useState("")
    const [open, setOpen] = useState(false)

    useEffect(() => {
        const interval = setInterval(async() => {
            const domainsWithStatus = await Promise.all(domains.map(async(domain) => {
                const response = await fetch(domain.url)
                return {...domain, status: response.status}
            }))
            setDomains(domainsWithStatus)
        }, timerRef.current)

        return () => {
            clearInterval(interval)
        }
    }, [])

    console.log("timer", `${timerRef.current / 1000}s`)

    return (
        <div>
            <h1 className={buttonStyle}>Domain status {allDomainsAreOperational ? '˅' : '˄'}<Pulse status={ServiceStatus.OPERATIONAL} /></h1>
            <div className="h-[1px] bg-superlight w-full" />
            {domains.map((domain) => <div key={domain.name} className={buttonStyle}>
                <h1>{domain.name}</h1>
                <Link href={domain.url}>{domain.url}</Link>
                <Pulse status={ServiceStatus.OPERATIONAL} />
            </div>)}
            <div className={`pb-2 ${!domains.length && 'pt-2'}`}>
                {open ? <div className="flex justify-between items-center px-2 text-almostbright bg-normal rounded-lg py-1">
                    <input  />
                    <h1 className="bg-login text-foreground">Add</h1>
                </div> : <div className="flex justify-between items-center px-2 text-almostbright bg-normal rounded-lg py-1">
                    <h1>Add domain</h1>
                    <h1 className="text-lg pr-[3px] text-login">+</h1>
                </div>}
            </div>
        </div>
    )
}
