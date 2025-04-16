'use client'

import { useRef, useState } from "react"

export default function Terminal() {
    const [text, setText] = useState("")
    const [isFocused, setIsFocused] = useState(false)
    const inputRef = useRef<HTMLTextAreaElement | null>(null)
    const terminalIndicator = "beekeeper $"
    const terminalStyle = `
        w-full h-full h-[8.5vh]
        bg-darker rounded-xl cursor-pointer p-2
        hover:bg-dark overflow-auto max-h-[45vh]
        ${isFocused ? 'scale-[0.99] mt-[2px] min-h-[calc(8.5vh-2px)] h-[calc(8.5vh-2px)] cursor-text' : 'scale-100 min-h-[8.5vh]'}
    `

    function autoResizeTextarea(textarea: HTMLTextAreaElement) {
        textarea.style.height = 'auto'
        textarea.style.height = `${textarea.scrollHeight}px`
    }

    function handleInput(input: string) {
        setText(input)
        autoResizeTextarea(inputRef.current as HTMLTextAreaElement)
    }

    return (
        <textarea 
            ref={inputRef}
            className={terminalStyle}
            placeholder={terminalIndicator}
            value={text}
            onChange={(event) => handleInput(event.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
        />
    )
}
