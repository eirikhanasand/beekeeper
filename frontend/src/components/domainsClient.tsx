'use client'

import Link from "next/link"
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react"
import Pulse from "./pulse"
import { ServiceStatus } from "@/interfaces"
import postDomain from "@/utils/fetch/namespace/domain/post"
import { removeCookie, setCookie } from "@/utils/cookies"

type DomainsClientProps = {
    context: string
    namespace: string
    domains: DomainsWithStatus[]
    domain: string
    domainURL: string
}

type FieldProps = {
    placeholder: string
    value: string
    setValue: Dispatch<SetStateAction<string>>
}

export default function DomainsClient({context, namespace, domains: Domains, domain, domainURL}: DomainsClientProps) {
    const [domains, setDomains] = useState(Domains)
    // const allDomainsAreOperational = true
    const buttonStyle = "bg-light w-full rounded-lg py-1 text-start flex justify-between items-center px-2 cursor-pointer text-almostbright"
    const timerRef = useRef(3000)
    const [timeLeft, setTimeLeft] = useState(timerRef.current / 1000)
    const [name, setName] = useState(domain)
    const [url, setURL] = useState(domainURL)
    const [result, setResult] = useState<{ status: number, message: any } | null>(null)
    const [open, setOpen] = useState(false)
    const allowEdit = namespace !== 'global'

    async function handleSubmit() {
        const response = await postDomain({
            name, 
            url: url.includes('http') ? url : `https://${url}`, 
            context, 
            namespace
        })
        if (response.status === 200) {
            setName("")
            setURL("")
            removeCookie('domain')
            removeCookie('domainURL')
            setOpen(false)
        }

        setResult(response)
    }

    function handleCancel() {
        setCookie('domain', name)
        setCookie('domainURL', url)
        setOpen(false)
    }
    
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
        <div>
            <div className="flex justify-between px-2">
                <h1 className="text-almostbright">Domain status</h1>
                {/* <h1 className="text-almostbright">Domain status {allDomainsAreOperational ? '˅' : '˄'}</h1> */}
                <div className="flex items-center gap-2">
                    <h1 className="text-extralight">{`${timeLeft === 0 ? 'fetching' : `${timeLeft}s`}`}</h1>
                    <Pulse status={domains.length ? ServiceStatus.OPERATIONAL : ServiceStatus.INACTIVE} />
                </div>
            </div>
            {(domains.length > 0 || allowEdit) && <div className="h-[1px] bg-superlight w-full" />}
            {domains.map((domain) => <div key={domain.name} className={buttonStyle}>
                <h1>{domain.name}</h1>
                <div className="flex items-center gap-2">
                    <Link href={domain.url} className="text-superlight">{domain.url}</Link>
                    <Pulse status={ServiceStatus.OPERATIONAL} />
                </div>
            </div>)}
            {allowEdit && <div className={`pb-2 ${!domains.length && 'pt-2'}`}>
                {open ? <div className="grid space-between items-center text-almostbright bg-normal rounded-lg gap-2 p-2">
                    {result && <h1 className={`w-full ${result.status === 200 ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-lg py-1 text-center`}>
                        {typeof result.message === 'string' ? result.message : JSON.stringify(result.message)}
                    </h1>}
                    <button onClick={handleCancel} className="cursor-pointer bg-superlight py-1 text-center w-full text-bright rounded-lg">Cancel</button>
                    <Field placeholder="Domain" value={name} setValue={setName} />
                    <Field placeholder="URL" value={url} setValue={setURL} />
                    <button onClick={handleSubmit} className="cursor-pointer bg-login py-1 text-center w-full text-bright rounded-lg">Add</button>
                </div> : <div onClick={() => setOpen(true)} className="select-none flex justify-between items-center px-2 text-almostbright bg-normal rounded-lg py-1">
                    <h1 className="select-none">Add domain</h1>
                    <h1 className="select-none text-lg pr-[3px] text-login">+</h1>
                </div>}
            </div>}
        </div>
    )
}

function Field({placeholder, value, setValue}: FieldProps) {
    return (
        <div className="w-full rounded-md py-1 outline outline-1 outline-almostbright relative mt-1">
            <h1 className="absolute -top-1 ml-2 text-sm bg-normal z-9 h-3 text-transparent px-1">{placeholder}</h1>
            <h1 className="absolute -top-[0.7rem] ml-2 text-sm px-1 z-10">{placeholder}</h1>
            <input 
                value={value} 
                onChange={(event) => setValue(event.target.value)}
                className="w-full rounded-lg text-almostbright px-2 focus:outline-none bg-transparent" 
            />
        </div>
    )
}
