'use client'

import Link from "next/link"
import { useEffect, useState } from "react"
import postIncident from "@/utils/fetch/namespace/incident/post"
import { removeCookie, setCookie } from "@/utils/cookies"
import ArrowOutward from "../svg/arrowOutward"
import FancyField from "../root/fancyField"
import { usePathname } from "next/navigation"

type IncidentsClientProps = {
    context: string
    namespace: string
    incidents: Incident[]
    incident: string
    incidentURL: string
    incidentTimestamp: string
}

export default function IncidentsClient({context, namespace, incidents, incident, incidentURL, incidentTimestamp}: IncidentsClientProps) {
    const buttonStyle = "bg-light w-full rounded-lg py-1 text-start flex justify-between items-center px-2 cursor-pointer text-almostbright"
    const [name, setName] = useState(incident)
    const [url, setURL] = useState(incidentURL)
    const [time, setTime] = useState(incidentTimestamp)
    const [result, setResult] = useState<{ status: number, message: any } | null>(null)
    const [open, setOpen] = useState(false)
    const path = usePathname()
    const allowEdit = namespace !== 'global' && !path.includes('/service/message')

    async function handleSubmit() {
        const response = await postIncident({
            name, 
            url: url.includes('http') ? url : `https://${url}`, 
            timestamp: time,
            context, 
            namespace
        })
        if (response.status === 200) {
            setName("")
            setURL("")
            removeCookie('incident')
            removeCookie('incidentURL')
            removeCookie('incidentTimestamp')
            setOpen(false)
        }

        setResult(response)
    }

    function handleCancel() {
        setCookie('incident', name)
        setCookie('incidentURL', url)
        setCookie('incidentTimestamp', time)
        setOpen(false)
    }

    useEffect(() => {
        if (name.length) {
            window.addEventListener('beforeunload', () => setCookie('incident', name))
        } else {
            window.addEventListener('beforeunload', () => removeCookie('incident'))
        }
        return () => {
            if (name.length) {
                window.removeEventListener('beforeunload', () => setCookie('incident', name))
            } else {
                window.removeEventListener('beforeunload', () => removeCookie('incident'))
            }
        }
    }, [name])

    useEffect(() => {
        if (url.length) {
            window.addEventListener('beforeunload', () => setCookie('incidentURL', url))
        } else {
            window.addEventListener('beforeunload', () => removeCookie('incidentURL'))
        }
        return () => {
            if (url.length) {
                window.removeEventListener('beforeunload', () => setCookie('incidentURL', url))
            } else {
                window.removeEventListener('beforeunload', () => removeCookie('incidentURL'))
            }
        }
    }, [url])

    useEffect(() => {
        if (time.length) {
            window.addEventListener('beforeunload', () => setCookie('incidentTimestamp', time))
        } else {
            window.addEventListener('beforeunload', () => removeCookie('incidentTimestamp'))
        }
        return () => {
            if (time.length) {
                window.removeEventListener('beforeunload', () => setCookie('incidentTimestamp', time))
            } else {
                window.removeEventListener('beforeunload', () => removeCookie('incidentTimestamp'))
            }
        }
    }, [time])

    return (
        <div>
            <Link
                target="_blank"
                href="https://wiki.login.no/tekkom/projects/infrastructure/incident" 
                className={buttonStyle}>All incidents<ArrowOutward className=' w-[1rem] h-[1rem] fill-login'/>
            </Link>
            {(incidents.length > 0 || allowEdit) && <div className="h-[1px] bg-superlight w-full" />}
            {incidents.map((incident) => <div key={incident.name} className={buttonStyle}>
                <Link target="_blank" href={incident.url} className="text-almostbright">{incident.name}</Link>
                <ArrowOutward className=' w-[1rem] h-[1rem] fill-login'/>
            </div>)}
            {allowEdit && <div className={`pb-2 ${!incidents.length && 'pt-2'}`}>
                {open ? <div className="grid space-between items-center text-almostbright bg-normal rounded-lg gap-2 p-2">
                    {result && <h1 className={`w-full ${result.status === 200 ? 'bg-green-500/20' : 'bg-red-500/20'} rounded-lg py-1 text-center`}>
                        {typeof result.message === 'string' ? result.message : JSON.stringify(result.message)}
                    </h1>}
                    <button onClick={handleCancel} className="cursor-pointer bg-superlight py-1 text-center w-full text-bright rounded-lg">Cancel</button>
                    <div className="relative grid gap-2">
                        <FancyField placeholder="Incident" value={name} setValue={setName} />
                        <FancyField placeholder="URL" value={url} setValue={setURL} />
                        <FancyField type="date" placeholder="Date" value={time} setValue={setTime} />
                        <h1 onClick={() => setTime(new Date().toISOString())} className="absolute bg-extralight px-2 rounded-lg bottom-1 right-1">now</h1>
                    </div>
                    <button onClick={handleSubmit} className="cursor-pointer bg-login py-1 text-center w-full text-bright rounded-lg">Add</button>
                </div> : <div onClick={() => setOpen(true)} className="select-none flex justify-between items-center px-2 text-almostbright bg-darker rounded-lg py-1">
                    <h1 className="select-none">Add incident</h1>
                    <h1 className="select-none text-lg pr-[3px] text-login">+</h1>
                </div>}
            </div>}
        </div>
    )
}
