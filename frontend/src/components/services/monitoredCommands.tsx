'use client'

import { Dispatch, SetStateAction, useState } from "react"
import Trash from "../svg/trash"
import { getCookie } from "@/utils/cookies"
import { useRouter } from "next/navigation"
import putLocalCommand from "@/utils/fetch/localCommand/put"
import putGlobalCommand from "@/utils/fetch/globalCommand/put"
import deleteLocalCommand from "@/utils/fetch/localCommand/delete"
import deleteGlobalCommand from "@/utils/fetch/globalCommand/delete"

type MonitoredCommandsProps = {
    globalCommands: GlobalCommandWithUser[]
    localCommands: LocalCommandWithUser[]
}

type GlobalCommandProps = {
    command: GlobalCommandWithUser
}

type LocalCommandProps = {
    command: LocalCommandWithUser
}

type FieldProps = {
    className?: string
    placeholder: string
    editing: boolean
    value: string
    setValue: Dispatch<SetStateAction<string>>
}

type EditAndDeleteProps = {
    editing: boolean
    handleEdit: () => void
    handleDelete: () => void
    handleCancel: () => void
    allowDelete: boolean
}

export default function MonitoredCommands({globalCommands, localCommands}: MonitoredCommandsProps) {
    const [active, setActive] = useState(false)

    if (active) {
        return (
            <div className="w-full h-[50vh] max-h-[50vh] bg-darker rounded-xl p-2">
                <div className="w-full h-full overflow-auto mb-2 noscroll text-foreground">
                    <h1 
                        onClick={() => setActive(false)} 
                        className="w-full overflow-auto mb-2 noscroll grid place-items-center text-almostbright cursor-pointer bg-normal rounded-lg py-1"
                    >
                        ↓ Monitored commands ↓
                    </h1>
                    <h1 className="text-almostbright">Global commands</h1>
                    <div className="grid gap-2 mb-2">
                        {globalCommands.map((command) => <GlobalCommand 
                            key={command.id}
                            command={command}
                        />)}
                    </div>
                    <h1 className="text-almostbright">Local commands</h1>
                    {localCommands.length > 0 ? <div>
                        {localCommands.map((command) => <LocalCommand 
                            key={command.id} 
                            command={command}
                        />)}
                    </div> : <h1 className="text-superlight">There are no local commands monitored specifically for this service.</h1>}
                </div>
            </div>
        )
    }

    return (
        <div className="w-full h-[4.7vh] max-h-[4.7vh] bg-darker rounded-xl pt-1 px-2 pb-2">
            <h1 
                onClick={() => setActive(true)} 
                className="w-full h-full overflow-auto mb-2 noscroll grid place-items-center text-almostbright cursor-pointer"
            >
                ↑ Monitored commands ↑
            </h1>
        </div>
    )
}

function GlobalCommand({command}: GlobalCommandProps) {
    const [allowDelete, setAllowDelete] = useState(false)
    const [reason, setReason] = useState(command.reason)
    const [name, setName] = useState(command.name)
    const [value, setValue] = useState(command.command)
    const [result, setResult] = useState<number | null>(null)
    const [editing, setEditing] = useState(false)
    const router = useRouter()

    async function handleEdit() {
        const token = getCookie('access_token')
        if (!token) {
            return router.push('/logout')
        }
        const response = await putGlobalCommand({
            router,
            token, 
            id: command.id, 
            name, 
            command: value, 
            author: String(command.author.email), 
            reason
        })
        setResult(response)
        setEditing(false)
    }

    function handleDelete() {
        const token = getCookie('access_token')
        if (!token) {
            return router.push('/logout')
        }

        if (allowDelete) {
            deleteGlobalCommand({token, id: command.id})
        } else {
            setAllowDelete(true)
        }
    }

    function handleCancel() {
        setReason(command.reason)
        setName(command.name)
        setValue(command.command)
        setEditing(false)
    }

    return (
        <div onMouseLeave={() => setAllowDelete(false)} className={`p-2 bg-light rounded-lg ${editing ? 'grid gap-2' : ''}`}>
            <div className="flex justify-between gap-2">
                <div className="flex gap-2">
                    <h1 className="min-w-[1rem] text-superlight text-sm">{command.id}</h1>
                    <Field placeholder="Name" value={name} setValue={setName} editing={editing} />
                </div>
                <div className="flex flex-col grid place-items-end flex-1">
                    <div className="flex items-center gap-2 w-full justify-end">
                        <Field className="text-superlight" placeholder="Reason" value={reason} setValue={setReason} editing={editing} />
                        <h1 className="text-superlight text-sm min-w-[8rem]">{new Date(command.timestamp).toLocaleString('no-NO')}</h1>
                        {!editing && <h1 onClick={() => setEditing(true)} className="xl:mr-1 text-almostbright cursor-pointer">✎</h1>}
                        {/* disable funksjon senere? puls for aktiv eller ikke? */}
                        {/* <Pulse
                            innerWidth="w-2" 
                            innerHeight="h-2"
                            active={false}
                            status={log.status as ServiceStatus}
                            /> */}
                    </div>
                </div>
            </div>
            <div className="ml-[1rem] pl-2 flex justify-between gap-2">
                <div className="flex flex-1">
                <Field className="text-almostbright" placeholder="Command" value={value} setValue={setValue} editing={editing} />
                </div>
                <div className={`${editing ? 'max-w-[30%] pt-1' : 'max-w-[16%] pr-[3px]'} flex gap-2`}>
                    <h1 className="text-superlight text-sm">{command.author.name}</h1>
                    <EditAndDelete 
                        editing={editing} 
                        allowDelete={allowDelete} 
                        handleEdit={handleEdit} 
                        handleDelete={handleDelete}
                        handleCancel={handleCancel}
                    />
                </div>
            </div >
        </div>
    )
}

function LocalCommand({command}: LocalCommandProps) {
    const [allowDelete, setAllowDelete] = useState(false)
    const [editing, setEditing] = useState(false)
    const [context, setContext] = useState(command.context)
    const [namespace, setNamespace] = useState(command.namespace)
    const [reason, setReason] = useState(command.reason)
    const [result, setResult] = useState<number | null>(null)
    const [name, setName] = useState(command.name)
    const [value, setValue] = useState(command.command)
    const router = useRouter()

    async function handleEdit() {
        const token = getCookie('access_token')
        if (!token) {
            return router.push('/logout')
        }
        const response = await putLocalCommand({
            router,
            token, 
            id: command.id,
            context, 
            namespace, 
            name, 
            command: value, 
            author: String(command.author.email), 
            reason
        })
        setResult(response)
        setEditing(false)
    }

    function handleDelete() {
        const token = getCookie('access_token')
        if (!token) {
            return router.push('/logout')
        }

        if (allowDelete) {
            deleteLocalCommand({token, id: command.id})
        } else {
            setAllowDelete(true)
        }
    }

    function handleCancel() {
        setContext(command.context)
        setNamespace(command.namespace)
        setReason(command.reason)
        setName(command.name)
        setValue(command.command)
        setEditing(false)
    }

    return (
        <div className="p-2 bg-light rounded-lg">
            <div className="flex justify-between">
                <div className="flex gap-2">
                    <h1 className="min-w-[1rem] text-superlight text-sm">{command.id}</h1>
                    <Field placeholder="Name" value={name} setValue={setName} editing={editing} />
                </div>
                <div className="flex flex-col grid place-items-end">
                    <div className="flex items-center gap-2">
                        {editing ? <input /> : <h1 className="text-sm text-superlight">{command.reason}</h1>}
                        <h1 className="text-superlight text-sm">{new Date(command.timestamp).toLocaleString('no-NO')}</h1>
                        <h1 onClick={() => setEditing(true)} className="xl:mr-1 text-almostbright cursor-pointer">✎</h1>
                        {/* disable funksjon senere? puls for aktiv eller ikke? */}
                        {/* <Pulse
                            innerWidth="w-2" 
                            innerHeight="h-2"
                            active={false}
                            status={log.status as ServiceStatus}
                            /> */}
                    </div>
                    <div className="text-superlight text-sm flex gap-2">
                        <Field placeholder="Namespace" value={namespace} setValue={setNamespace} editing={editing} />
                        <h1>-</h1>
                        <Field placeholder="Context" value={context} setValue={setContext} editing={editing} />
                        <h1>| {command.author.name}</h1>
                    </div>
                    <EditAndDelete 
                        editing={editing} 
                        allowDelete={allowDelete} 
                        handleEdit={handleEdit} 
                        handleDelete={handleDelete}
                        handleCancel={handleCancel}
                    />
                </div>
            </div>
            <div className="ml-[1rem] pl-2 flex justify-between">
                <div className="max-w-[84%]">
                    <Field className="text-almostbright" placeholder="Command" value={value} setValue={setValue} editing={editing} />
                </div>
            </div >
        </div>
    )
}

function Field({className, placeholder, editing, value, setValue}: FieldProps) {
    if (editing) {
        return (
            <input
                placeholder={placeholder}
                className="bg-extralight text-almostbright rounded-lg px-2 text-sm w-full"
                value={value}
                onChange={(event) => setValue(event.target.value)}
            />
        )
    }
    
    return <h1 className={`min-w-[6rem] text-sm ${className}`}>{value}</h1>
}

function EditAndDelete({editing, allowDelete, handleEdit, handleDelete, handleCancel}: EditAndDeleteProps) {
    if (editing) {
        return (
            <>
                <h1 onClick={handleCancel} className="h-fit w-fit bg-superlight hover:bg-login px-4 cursor-pointer rounded-lg text-sm">Cancel</h1>
                <div onClick={handleEdit}>
                    <h1 className="bg-superlight hover:bg-login px-4 cursor-pointer rounded-lg text-sm">Save</h1>
                </div>
            </>
        )
    }
    
    return (
        <div onClick={handleDelete}>
            <Trash fill={`${allowDelete ? 'fill-red-500' : 'fill-almostbright'} hover:fill-red-500 h-4 w-4 cursor-pointer`} />
        </div>
    )
}
