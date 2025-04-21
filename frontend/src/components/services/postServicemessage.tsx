'use client'

import { useState } from "react"
import FancyField from "../fancyField"
import postServiceMessage from "@/utils/fetch/namespace/message/post"
import { getCookie, setCookie } from "@/utils/cookies"
import { usePathname, useRouter } from "next/navigation"

type PostServiceMessageProps = {
    title: string
    content: string
    status: string
}

export default function PostServiceMessage({title: Title, content: Content, status: Status}: PostServiceMessageProps) {
    const [title, setTitle] = useState(Title)
    const [content, setContent] = useState(Content)
    const [status, setStatus] = useState(Status)
    const router = useRouter()
    const path = usePathname()

    function handleCancel() {
        // bytt til service message
        setCookie('serviceMessageTitle', title)
        setCookie('serviceMessageContent', content)
        setCookie('serviceMessageStatus', status)
    }
    
    function handleSubmit() {
        const token = getCookie('access_token')
        const author = getCookie('email')
        if (!token || !author) {
            setCookie('redirect', path)
            return router.push('/logout')
        }
        postServiceMessage({ title, content, author, status }, token)
    }

    return (
        <div className="w-full h-full bg-darker rounded-xl p-2">
            <h1>Post Service Message</h1>
            <div className="grid gap-2">
                <button onClick={handleCancel} className="cursor-pointer bg-superlight py-1 text-center w-full text-bright rounded-lg">Cancel</button>
                <FancyField placeholder="Incident title" value={title} setValue={setTitle} />
                <FancyField placeholder="Message" value={content} setValue={setContent} />
                <FancyField placeholder="Status" value={status} setValue={setStatus} />
                <button onClick={handleSubmit} className="cursor-pointer bg-login py-1 text-center w-full text-bright rounded-lg">Add</button>
            </div>
        </div>
    )
}
