'use client'

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function ToolTips() {
    const [display, setDisplay] = useState(false)
    const path = usePathname()
    const router = useRouter()

    useEffect(() => {
        function handleKeyDown(e: KeyboardEvent) {
            const activeElement = document.activeElement
            if (activeElement?.tagName === 'INPUT' || activeElement?.tagName === 'TEXTAREA') {
                return
            }

            const key = e.key.toLowerCase()
            if (key === 'q') {
                setDisplay(prevDisplay => !prevDisplay)
                localStorage.setItem('tooltips', 'false')
            }
            if (key === 's') {
                setDisplay(false)
                localStorage.setItem('tooltips', 'false')
                if (!path.includes('/service/message')) {
                    router.push('/service/message')
                }
            }
            if (path.includes('/service/message') && key === 'b') {
                router.push('/service/prod/global')
            }
        }

        window.addEventListener('keydown', handleKeyDown)

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [display, path])

    useEffect(() => {
        function checkTooltips() {
            const tooltips = localStorage.getItem('tooltips')
            if (tooltips === 'true') {
                setDisplay(true)
            }
        }

        function handleStorageChange(e: Event) {
            const event = e as CustomEvent
            if (event.detail.key === 'tooltips') {
                setDisplay(event.detail.value === 'true')
            }
        }

        window.addEventListener('customStorageChange', handleStorageChange)

        checkTooltips()

        return () => {
            window.removeEventListener('customStorageChange', handleStorageChange)
        }
    }, [])

    if (!display) {
        return <></>
    }

    return (
        <div className="w-full h-full fixed left-0 top-0 grid place-items-center bg-black bg-dark/50 z-10" onClick={() => setDisplay(false)}>
            <div className="w-[55vw] h-[63vh] bg-normal rounded-xl p-8 overflow-auto noscroll">
                <h1 className="w-full text-center text-xl font-semibold mb-2">Tooltips</h1>
                <div className="grid grid-cols-2">
                    <div className="w-full">
                        {/* first column */}
                        <Tips hotkey="Q" info="Displays this message" />
                        <Tips hotkey="S + Auth" info="Edit the service status feed" />
                    </div>
                    <div className="w-full">
                        {/* second column */}
                    </div>
                </div>
            </div>
        </div>
    )
}

function Tips({hotkey, info, extraHotKey}: {hotkey: string, info: string, extraHotKey?: string}) {
    return (
        <div className="w-full p-2 flex flex-rows">
            {extraHotKey && <h1 className="text-sm px-2 bg-superlight rounded-md grid place-items-center mr-2">{extraHotKey}</h1>}
            {extraHotKey && <h1 className="text-sm grid place-items-center mr-2">+</h1>}
            <h1 className="text-sm px-2 bg-superlight rounded-md grid place-items-center mr-2">{hotkey}</h1>
            <h1 className="text-sm grid place-items-center">{info}</h1>
        </div>
    )
}
