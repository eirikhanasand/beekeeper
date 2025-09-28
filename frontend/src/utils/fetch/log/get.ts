import config from "@/constants"
import debug from "@/utils/debug"

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

type LogParams = {
    location: 'server' | 'client'
    path: 'global' | 'local'
    page: number
    resultsPerPage?: number
    namespace?: string
    context?: string
    search?: string
}

type Log = {
    page: number
    resultsPerPage: number
    pages: number
    results: (LocalLog | GlobalLog)[]
    error?: string
}

export default async function getLogs({
    location,
    path,
    page,
    namespace,
    context,
    search,
    resultsPerPage
}: LogParams): Promise<Log> {
    const baseUrl = `${location === 'server' ? config.url.API : API_URL}/log/${path}`
    const params = new URLSearchParams({ page: String(page) })
    const isGlobal = namespace === 'global'
    resultsPerPage && params.set('resultsPerPage', String(resultsPerPage))
    !isGlobal && namespace && params.set('namespace', namespace)
    context && params.set('context', context)
    search && params.set('search', search)
    const url = `${baseUrl}?${params.toString()}`
    debug({
        basic: `Fetching logs from ${url}`,
        detailed: `Fetching logs (${location}) from ${url}`,
    })

    try {
        const response = await fetch(url, {
            next: { revalidate: 10 },
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })

        if (!response.ok) {
            const data = await response.json()
            debug({ detailed: { message: `Fetching logs (${location}) from ${url} failed`, data } })
            throw Error(data.error)
        }

        const services = await response.json()
        debug({ full: { message: `Fetching logs (${location}) with url ${url} completed successfully`, data: services } })
        return services
    } catch (error) {
        debug({ production: { message: `Fetching logs (${location}) from ${url} failed`, error } })
        return {
            page: 1,
            pages: 1,
            resultsPerPage: 0,
            error: `Fetching logs (${location}) from ${url} failed`,
            results: []
        }
    }
}
