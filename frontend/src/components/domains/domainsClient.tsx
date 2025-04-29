'use client'

import Link from "next/link"
import { useEffect, useRef, useState } from "react"
import Pulse from "../root/pulse"
import { ServiceStatus } from "@/interfaces"
// import postDomain from "@/utils/fetch/namespace/domain/post"
import { removeCookie, setCookie } from "@/utils/cookies"
// import FancyField from "../root/fancyField"
import { usePathname } from "next/navigation"

type DomainsClientProps = {
    context: string
    namespace: string
    domains: DomainsWithStatus[]
    domain: string
    domainURL: string
}

export default function DomainsClient({context: _, namespace, domains: Domains, domain, domainURL}: DomainsClientProps) {
// export default function DomainsClient({context, namespace, domains: Domains, domain, domainURL}: DomainsClientProps) {
    const [domains, setDomains] = useState(Domains)
    const timerRef = useRef(3000)
    const [timeLeft, setTimeLeft] = useState(timerRef.current / 1000)
    const [name, __] = useState(domain)
    const [url, ___] = useState(domainURL)
    // const allDomainsAreOperational = true
    // const [name, setName] = useState(domain)
    // const [url, setURL] = useState(domainURL)
    // const [response, setResponse] = useState<Result | null>(null)
    // const [open, setOpen] = useState(false)
    const path = usePathname()
    const allowEdit = namespace !== 'global' && !path.includes('/service/message')

    // async function handleSubmit() {
    //     const response = await postDomain({
    //         name, 
    //         url: url.includes('http') ? url : `https://${url}`, 
    //         context, 
    //         namespace
    //     })
    //     if (response.status === 200) {
    //         setName("")
    //         setURL("")
    //         removeCookie('domain')
    //         removeCookie('domainURL')
    //         setOpen(false)
    //     }

    //     setResponse(response)
    // }

    // function handleCancel() {
    //     setCookie('domain', name)
    //     setCookie('domainURL', url)
    //     setOpen(false)
    // }
    
    useEffect(() => {
        const countdown = setInterval(() => {
            setTimeLeft((prev) => (prev > 0 ? prev - 1 : timerRef.current / 1000))
        }, 1000)

        return () => clearInterval(countdown)
    }, [])

    useEffect(() => {
        const interval = setInterval(async() => {
            const domainsWithStatus = await Promise.all(domains.map(async(domain) => {
                const response = await fetch(domain.url)
                return {...domain, status: response.status}
            }))
            setDomains(domainsWithStatus)
            setTimeLeft(timerRef.current / 1000)
        }, timerRef.current)

        return () => {
            clearInterval(interval)
        }
    }, [])

    useEffect(() => {
        if (name.length) {
            window.addEventListener('beforeunload', () => setCookie('domain', name))
        } else {
            window.addEventListener('beforeunload', () => removeCookie('domain'))
        }
        return () => {
            if (name.length) {
                window.removeEventListener('beforeunload', () => setCookie('domain', name))
            } else {
                window.removeEventListener('beforeunload', () => removeCookie('domain'))
            }
        }
    }, [name])

    useEffect(() => {
        if (url.length) {
            window.addEventListener('beforeunload', () => setCookie('domainURL', url))
        } else {
            window.addEventListener('beforeunload', () => removeCookie('domainURL'))
        }
        return () => {
            if (url.length) {
                window.removeEventListener('beforeunload', () => setCookie('domainURL', url))
            } else {
                window.removeEventListener('beforeunload', () => removeCookie('domainURL'))
            }
        }
    }, [url])

    return (
        <div className="grid gap-2 pb-1">
            <div className="flex justify-between px-2">
                <h1 className="text-almostbright">Domain status</h1>
                {/* <h1 className="text-almostbright">Domain status {allDomainsAreOperational ? '˅' : '˄'}</h1> */}
                <div className="flex items-center gap-2">
                    <h1 className="text-extralight">{`${timeLeft === 0 ? 'fetching' : `${timeLeft}s`}`}</h1>
                    <Pulse status={domains.length ? ServiceStatus.OPERATIONAL : ServiceStatus.INACTIVE} />
                </div>
            </div>
            {(domains.length > 0 || allowEdit) && <div className="h-[1px] bg-superlight w-full" />}
            {domains.toReversed().map((domain) => {
                const formattedDomain = domain.name.includes('-') 
                    ? `${domain.name.split('-')[1][0].toUpperCase()}${domain.name.split('-')[1].slice(1)}`
                    : domain.name
                return (
                    <Link
                        href={domain.url}
                        key={domain.name} 
                        className="bg-darker w-full rounded-lg cursor-pointer text-almostbright py-1 px-2"
                    >
                        <h1 className="flex justify-between items-center">{formattedDomain}<Pulse status={ServiceStatus.OPERATIONAL} /></h1>
                        <h1 className="text-superlight text-xs">{domain.url}</h1>
                    </Link>
                )
            })}
            {/* {allowEdit && <div className={`pb-2 ${!domains.length && 'pt-2'}`}>
                {open ? <div className="grid space-between items-center text-almostbright bg-normal rounded-lg gap-2 p-2">
                    {response && <h1 className={`w-full ${response.status === 200 ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-lg py-1 text-center`}>
                        {response.message}
                    </h1>}
                    <button onClick={handleCancel} className="cursor-pointer bg-superlight py-1 text-center w-full text-bright rounded-lg">Cancel</button>
                    <FancyField placeholder="Domain" value={name} setValue={setName} />
                    <FancyField placeholder="URL" value={url} setValue={setURL} />
                    <button onClick={handleSubmit} className="cursor-pointer bg-login py-1 text-center w-full text-bright rounded-lg">Add</button>
                </div> : <div onClick={() => setOpen(true)} className="select-none flex justify-between items-center px-2 text-almostbright bg-darker rounded-lg py-1">
                    <h1 className="select-none">Add domain</h1>
                    <h1 className="select-none text-lg pr-[3px] text-login">+</h1>
                </div>}
            </div>} */}
        </div>
    )
}
