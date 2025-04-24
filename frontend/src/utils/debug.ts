import { Debug } from "@/interfaces"

type Log = {
    production?: { message: string, error: any }
    basic?: string
    detailed?: string | { message: string, data?: any}
    full?: string | { message: string, data?: any }
}

export default function debug({ basic: Basic, detailed: Detailed, full: Full, production: Production }: Log) {
    const production = [Debug.PRODUCTION]
    const basic = [Debug.PRODUCTION, Debug.BASIC]
    const detailed = [Debug.PRODUCTION, Debug.BASIC, Debug.DETAILED]
    const full = [Debug.PRODUCTION, Debug.BASIC, Debug.DETAILED, Debug.FULL]
    const level = {
        production,
        basic,
        detailed,
        full
    }[process.env.NEXT_PUBLIC_DEBUG || Debug.PRODUCTION] || []

    if (level.includes(Debug.PRODUCTION) && Production) {
        console.log(`${Production.message}:`)
        console.error(Production.error)
    }
    if (level.includes(Debug.BASIC) && Basic) {
        console.log(Basic)
    }
    if (level.includes(Debug.DETAILED) && Detailed) {
        if (typeof Detailed === 'string') {
            console.log(Detailed)
        } else {
            console.log(`${Detailed.message}: ${JSON.stringify(Detailed.data)}`)
        }
    }
    if (level.includes(Debug.FULL) && Full) {
        if (typeof Full === 'string') {
            console.log(Full)
        } else {
            console.log(`${Full.message}: ${JSON.stringify(Full.data)}`)
        }
    }
}
