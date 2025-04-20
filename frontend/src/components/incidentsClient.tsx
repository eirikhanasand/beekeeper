'use client'

import Link from "next/link"
import { Dispatch, SetStateAction, useEffect, useState } from "react"
import Pulse from "./pulse"
import { ServiceStatus } from "@/interfaces"
import postIncident from "@/utils/fetch/namespace/incident/post"
import { removeCookie, setCookie } from "@/utils/cookies"
import ArrowOutward from "./svg/arrowOutward"

type IncidentsClientProps = {
    context: string
    namespace: string
    incidents: Incident[]
    incident: string
    incidentURL: string
    incidentTimestamp: string
}

type FieldProps = {
    placeholder: string
    value: string
    setValue: Dispatch<SetStateAction<string>>
    type?: string
}

export default function IncidentsClient({context, namespace, incidents, incident, incidentURL, incidentTimestamp}: IncidentsClientProps) {
    const buttonStyle = "bg-light w-full rounded-lg py-1 text-start flex justify-between items-center px-2 cursor-pointer text-almostbright"
    const [name, setName] = useState(incident)
    const [url, setURL] = useState(incidentURL)
    const [time, setTime] = useState(incidentTimestamp)
    const [result, setResult] = useState<{ status: number, message: any } | null>(null)
    const [open, setOpen] = useState(false)
    const allowEdit = namespace !== 'global'

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
                        <Field placeholder="Incident" value={name} setValue={setName} />
                        <Field placeholder="URL" value={url} setValue={setURL} />
                        <Field type="date" placeholder="Date" value={time} setValue={setTime} />
                        <h1 onClick={() => setTime(new Date().toISOString())} className="absolute bg-extralight px-2 rounded-lg bottom-1 right-1">now</h1>
                    </div>
                    <button onClick={handleSubmit} className="cursor-pointer bg-login py-1 text-center w-full text-bright rounded-lg">Add</button>
                </div> : <div onClick={() => setOpen(true)} className="select-none flex justify-between items-center px-2 text-almostbright bg-normal rounded-lg py-1">
                    <h1 className="select-none">Add incident</h1>
                    <h1 className="select-none text-lg pr-[3px] text-login">+</h1>
                </div>}
            </div>}
        </div>
    )
}

function Field({placeholder, value, setValue, type}: FieldProps) {
    const date = type === "date" ? new Date(value) : new Date()
    const content = type === "date" 
        ? `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
        : value

    function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
        const input = event.target.value
        if (type === "date") {
            const date = new Date()
            date.setFullYear(Number(input.slice(0, 4)))
            date.setMonth(Number(input.slice(5, 7)) + 1)
            date.setDate(Number(input.slice(8, 10)))
            setValue(date.toISOString())
        } else {
            setValue(input)
        }
    }

    return (
        <div className="w-full rounded-md py-1 outline outline-1 outline-almostbright relative mt-1">
            <h1 className="absolute -top-1 ml-2 text-sm bg-normal z-9 h-3 text-transparent px-1">{placeholder}</h1>
            <h1 className="absolute -top-[0.7rem] ml-2 text-sm px-1 z-10">{placeholder}</h1>
            <input 
                type={type || "text"}
                value={content} 
                onChange={handleChange}
                className="w-full rounded-lg text-almostbright px-2 focus:outline-none bg-transparent" 
            />
        </div>
    )
}
