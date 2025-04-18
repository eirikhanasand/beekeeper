import { ServiceStatus } from "@parent/interfaces"
import { ReactNode } from "react"

type PulseProps = {
    status: ServiceStatus
    outerWidth?: string
    outerHeight?: string
    innerWidth?: string
    innerHeight?: string
    active?: false
    children?: ReactNode
}

export default function Pulse({ status, outerWidth, outerHeight, innerWidth, innerHeight, active, children }: PulseProps) {
    const color = {
        operational: 'bg-green-500',
        degraded: 'bg-login',
        down: 'bg-red-500'
    }[status] || 'bg-gray-500'

    const OuterWidth = outerWidth ? outerWidth : "w-3"
    const OuterHeight = outerHeight ? outerHeight : "h-3"
    const InnerWidth = innerWidth ? innerWidth : "w-2.5"
    const InnerHeight = innerHeight ? innerHeight : "h-2.5"

    return (
        <div className={`relative ${OuterWidth} ${OuterHeight} grid place-items-center`}>
            {/* Pulsating outer ring */}
            {active !== false ? <div className={`absolute inline-flex h-full w-full rounded-full ${color} opacity-75 animate-ping`} /> : <></>}
            {/* Solid center circle */}
            <div className={`relative inline-flex rounded-full ${InnerWidth} ${InnerHeight} ${color}`}>
                {children}
            </div>
        </div>
    )
}
