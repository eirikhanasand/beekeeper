'use client'

import { getCookie, removeCookie, setCookie } from "@/utils/cookies"
import getSegmentedPathname from "@/utils/fetch/get/pathname"
import postGlobalCommand from "@/utils/fetch/post/postGlobalCommand"
import postLocalCommand from "@/utils/fetch/post/postLocalCommand"
import { usePathname, useRouter } from "next/navigation"
import { ChangeEvent, useEffect, useRef, useState } from "react"

type TerminalProps = {
    namespace: string
    command: string
    name: string
    reason: string
}

export default function Terminal({namespace, command, name: Name, reason: Reason}: TerminalProps) {
    const [text, setText] = useState(command)
    const [name, setName] = useState(Name)
    const [reason, setReason] = useState(Reason)
    const [isFocused, setIsFocused] = useState(false)
    const inputRef = useRef<HTMLTextAreaElement | null>(null)
    const [inputSeemsValid, setInputSeemsValid] = useState(false)
    const [acceptedRisk, setAcceptedRisk] = useState(false)
    const [promptForRisk, setPromptForRisk] = useState(false)
    const [inputSeemsLocal, setInputSeemsLocal] = useState(false)
    const [result, setResult] = useState<number | null>(null)
    const router = useRouter()
    const path = usePathname()
    const segmentedPathname = getSegmentedPathname(path)
    const context = segmentedPathname[1] || 'prod'
    const currentCommandStatusLabel = inputSeemsValid || acceptedRisk ? 'Valid command': 'Invalid command'
    const currentCommandTextLabel = inputSeemsLocal ? 'Local': 'Global'
    const terminalIndicator = "beekeeper $"
    const legitimateStrings = ['kubectl', 'docker', 'flux', 'helm', 'kubelet', 'grafana', 'prometheus', 'helmfile', 'k9s', 'namespace']
    const terminalStyle = `
        w-full h-full h-[9vh]
        bg-darker rounded-xl cursor-pointer p-2
        hover:bg-dark overflow-auto max-h-[45vh]
        ${isFocused ? 'scale-[0.99] mt-1 min-h-[calc(9vh-2px)] h-[calc(9.2vh-2px)] cursor-text' : 'scale-100 min-h-[9.2vh]'}
    `

    function autoResizeTextarea(textarea: HTMLTextAreaElement) {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
    }

    function handleInput(event: ChangeEvent<HTMLTextAreaElement>) {
        const input = event.target.value
        setText(input)
        autoResizeTextarea(inputRef.current as HTMLTextAreaElement)

        let valid = false
        let local = false
        for (const value of input.split(' ')) {
            const word = value.toLowerCase()
            if (legitimateStrings.includes(word)) {
                valid = true
            }

            if (input.includes('-n') && !input.includes('-n {namespace}')) {
                local = true
            }
        }
        setInputSeemsLocal(local)
        setInputSeemsValid(valid)
        setAcceptedRisk(false)
    }

    async function submit(event: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (event.key !== 'Enter' || event.shiftKey) {
            return
        }

        if (!inputSeemsValid && !promptForRisk) {
            return setPromptForRisk(true)
        }

        const token = getCookie('access_token')
        const author = getCookie('email')
        if (!token || !author) {
            return router.push('/logout')
        }

        const response = inputSeemsLocal 
            ? await postLocalCommand({ router, token, context, name, namespace, command: text, author, reason })
            : await postGlobalCommand({ router, token, name, command: text, author, reason })

        setResult(response)
        if (response === 200) {
            setAcceptedRisk(false)
            setInputSeemsValid(false)
            setText("")
            setReason("")
            setName("")
            setTimeout(() => {
                setText("")
                setReason("")
                setName("")
            }, 10)
        }
    }

    useEffect(() => {
        if (text.length) {
            window.addEventListener('beforeunload', () => setCookie('command', text))
        } else {
            window.addEventListener('beforeunload', () => removeCookie('command'))
        }
        return () => {
            if (text.length) {
                window.removeEventListener('beforeunload', () => setCookie('command', text))
            } else {
                window.removeEventListener('beforeunload', () => removeCookie('command'))
            }
        }
    }, [text])

    useEffect(() => {
        if (name.length) {
            window.addEventListener('beforeunload', () => setCookie('commandName', name))
        } else {
            window.addEventListener('beforeunload', () => removeCookie('commandName'))
        }
        return () => {
            if (name.length) {
                window.removeEventListener('beforeunload', () => setCookie('commandName', name))
            } else {
                window.removeEventListener('beforeunload', () => removeCookie('commandName'))
            }
        }
    }, [name])

    useEffect(() => {
        if (reason.length) {
            window.addEventListener('beforeunload', () => setCookie('commandReason', reason))
        } else {
            window.addEventListener('beforeunload', () => removeCookie('commandReason'))
        }
        return () => {
            if (reason.length) {
                window.removeEventListener('beforeunload', () => setCookie('commandReason', reason))
            } else {
                window.removeEventListener('beforeunload', () => removeCookie('commandReason'))
            }
        }
    }, [reason])

    return (
        <div className="relative grid gap-2 pb-2">
            {text.length > 0 && <div className="flex justify-between gap-2">
                <div className="w-full rounded-lg bg-darker p-2">
                    <input 
                        placeholder="Command Name"
                        className="w-full h-full"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />
                </div>
                <div className="w-full rounded-lg bg-darker p-2">
                    <input 
                        placeholder="Reason"
                        className="w-full h-full"
                        value={reason}
                        onChange={(event) => setReason(event.target.value)}
                    />
                </div>
            </div>}
            <textarea 
                ref={inputRef}
                className={terminalStyle}
                placeholder={terminalIndicator}
                onKeyDown={submit}
                value={text}
                onChange={handleInput}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
            />
            <div className={`text-almostbright absolute bottom-4 ${isFocused ? 'right-3' : 'right-2'} flex gap-2`}>
                {text.length > 0 && (!name.length || !reason.length) && <button 
                    className="bg-superlight/20 rounded-lg px-5 text-red-500"
                >
                    Empty name or reason
                </button>}
                {text.length > 0 && !inputSeemsValid && <h1 className={`${currentCommandStatusLabel.toLowerCase().includes('invalid') ? 'text-red-500' : 'text-almostbright'} bg-superlight/20 rounded-lg px-5`}>
                    {currentCommandStatusLabel}
                </h1>}
                {text.length > 0 && !inputSeemsValid && !acceptedRisk && <button 
                    onClick={() => setAcceptedRisk(true)} 
                    className="bg-almostbright/20 cursor-pointer rounded-lg px-5"
                >
                    Override invalid warning
                </button>}
                <h1 className="bg-superlight/20 rounded-lg px-5">
                    {currentCommandTextLabel}
                </h1>
                {text.length > 0 && name.length > 0 && reason.length > 0 && (inputSeemsValid || acceptedRisk) && <button 
                    onClick={() => submit({key: 'Enter'} as React.KeyboardEvent<HTMLTextAreaElement>)} 
                    className="bg-login cursor-pointer text-white rounded-lg px-5"
                >
                    Submit
                </button>}
            </div>
        </div>
    )
}
