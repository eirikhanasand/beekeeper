import { FastifyReply, FastifyRequest } from "fastify"
import run from "@db"
import { loadSQL } from "@utils/loadSQL.js"
import config from '@constants'

const { DEFAULT_RESULTS_PER_PAGE } = config

type LogProps = { 
    resultsPerPage?: string 
    page?: string,
    namespace?: string
    search?: string
}

export default async function getLog(req: FastifyRequest, res: FastifyReply) {
    const { log } = req.params as { log: string } || {}
    const { resultsPerPage: clientResultsPerPage, page, namespace, search } = req.query as LogProps || {}
    const resultsPerPage = Number(clientResultsPerPage) || DEFAULT_RESULTS_PER_PAGE

    if (log !== 'local' && log !== 'global') {
        return res.send({
            page,
            resultsPerPage,
            results: [],
            error: "Invalid log parameter (log !== 'local' && log !== 'global')"
        })
    }

    const isLocal = log === 'local'
    const logQueryFile = isLocal ? 'fetchLocalLog.sql' : 'fetchGlobalLog.sql'
    const logCountQueryFile = isLocal ? 'fetchLocalLogCount.sql' : 'fetchGlobalLogCount.sql'
    const logQueryParameters = isLocal
        ? [Number(page) || 1, resultsPerPage, namespace || null, search || null]
        : [Number(page) || 1, resultsPerPage, search || null]
    const logCountQueryParameters = isLocal ? [namespace || null, search || null] : [search || null]

    try {
        const logQuery = (await loadSQL(logQueryFile))
        const logCountQuery = (await loadSQL(logCountQueryFile))
        const result = await run(logQuery, logQueryParameters)
        const count = await run(logCountQuery, logCountQueryParameters)
        const pages = Math.ceil((Number(count.rows[0].count) || 1) / resultsPerPage)
        if ((Number(page) || 1) > pages) {
            console.error(`Page does not exist (${page} / ${pages})`)
            return res.send({
                namespace: namespace || 'global',
                page,
                pages,
                resultsPerPage,
                error: `Page does not exist (${page} / ${pages})`,
                results: []
            })
        }

        return res.send({
            page,
            pages,
            resultsPerPage,
            results: result.rows
        })
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
