'use client'

import { ServiceStatus } from "@/interfaces"
import Pulse from "../root/pulse"
import { useEffect, useState } from "react"
import { getCookie, removeCookie, setCookie } from "@/utils/cookies"
import FancyField from "../root/fancyField"
import Trash from "../svg/trash"
import { usePathname, useRouter } from "next/navigation"
import deleteMessage from "@/utils/fetch/message/delete"
import putMessage from "@/utils/fetch/message/put"
import './editableMessage.css'

type MessageProps = {
    message: Message
    shrink?: true
    author: string
}

export default function EditableMessage({ message, shrink, author }: MessageProps) {
    const [allowDelete, setAllowDelete] = useState(false)
    const [title, setTitle] = useState(message.title)
    const [content, setContent] = useState(message.content)
    const [status, setStatus] = useState(message.status)
    const [editing, setEditing] = useState(false)
    const [response, setResponse] = useState<Result | null>(null)
    const path = usePathname()
    const router = useRouter()
    const serviceStatus = {
        'Investigating': ServiceStatus.DOWN,
        'Identified': ServiceStatus.DEGRADED,
        'Resolved': ServiceStatus.OPERATIONAL,
    }[status] || ServiceStatus.INACTIVE

    function handleCancel() {
        setCookie('messageTitle', title)
        setCookie('messageContent', content)
        setCookie('messageStatus', status)
        setEditing(false)
    }

    async function handleDelete() {
        const token = getCookie('access_token')
        if (!token) {
            return router.push('/logout')
        }

        if (allowDelete) {
            const response = await deleteMessage(message.id, token)
            setResponse({ status: response, result: { message: 'Message deleted successfully. It will disappear on refresh.' } })
        } else {
            setAllowDelete(true)
        }
    }

    async function handleSave() {
        const token = getCookie('access_token')
        const author = getCookie('email')
        if (!token || !author) {
            setCookie('redirect', path)
            return router.push('/logout')
        }
        const response = await putMessage({ id: message.id, title, content, author, status }, token)
        if (response.status === 200) {
            removeCookie('messageTitle')
            removeCookie('messageContent')
            removeCookie('messageStatus')

            setTimeout(() => {
                setResponse(null)
            }, 3000)
            setEditing(false)
        }
        setResponse(response)
    }

    useEffect(() => {
        window.addEventListener('beforeunload', () => {
            title.length ? setCookie('messageTitle', title) : removeCookie('messageTitle')
            content.length ? setCookie('messageContent', content) : removeCookie('messageContent')
            status.length ? setCookie('messageStatus', status) : removeCookie('messageStatus')
        })
        return () => {
            window.removeEventListener('beforeunload', () => {
                title.length ? setCookie('messageTitle', title) : removeCookie('messageTitle')
                content.length ? setCookie('messageContent', content) : removeCookie('messageContent')
                status.length ? setCookie('messageStatus', status) : removeCookie('messageStatus')
            })
        }
    }, [title, content, status])

    if (editing) {
        return (
            <div className="rounded-lg px-[1px] grid gap-2">
                {response !== null && <h1 className={`${response.status === 200 ? 'bg-green-500/20' : 'bg-red-500/20'} py-1 text-center w-full text-bright rounded-lg mt-1 mb-2`}>
                    {response.status === 200 ? response.result.message : response.result.error}
                </h1>}
                {editing && <button onClick={handleCancel} className="cursor-pointer bg-superlight py-1 text-center w-full text-bright rounded-lg">Cancel</button>}
                <FancyField placeholder="Title" value={title} setValue={setTitle} />
                <FancyField placeholder="Content" value={content} setValue={setContent} />
                <FancyField placeholder="Status" value={status} setValue={setStatus} />
                <button onClick={handleSave} className="cursor-pointer bg-login py-1 text-center w-full text-bright rounded-lg">Save</button>
            </div>
        )
    }

    return (
        <div className="w-full">
            {response !== null && <h1 className={`${response.status === 200 ? 'bg-green-500/20' : 'bg-red-500/20'} py-1 text-center w-full text-bright rounded-lg mt-1 mb-2`}>
                {response.result.message}
            </h1>}
            <div className="bg-light rounded-lg flex gap-2 p-2">
                <div className="w-full">
                    <div className="flex justify-between items-center">
                        <h1 className="font-semibold">{title}</h1>
                        <Pulse status={serviceStatus} />
                    </div>
                    <h1 className={shrink ? 'text-xs' : 'text-sm'}>{content}</h1>
                    <div className={`flex justify-between text-superlight ${shrink ? 'text-xs' : 'text-sm'}`}>
                        <h1>Posted by {author}</h1>
                        <h1>{new Date(message.timestamp).toLocaleString('no-NO')}</h1>
                    </div>
                </div>
                <div className="w-[1px] h-full bg-superlight" />
                <div className="grid place-items-center">
                    <div onClick={() => setEditing(true)}>
                        <h1 className="edit text-almostbright h-4 w-4 cursor-pointer">✎</h1>
                    </div>
                    <div onClick={handleDelete}>
                        <Trash fill={`${allowDelete ? 'fill-red-500' : 'fill-almostbright'} hover:fill-red-500 h-4 w-4 cursor-pointer`} />
                    </div>
                </div>
            </div>
        </div>
    )
}
