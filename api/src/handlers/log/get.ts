import { FastifyReply, FastifyRequest } from "fastify"
import run from "@db"
import { loadSQL } from "@utils/loadSQL.js"
import config from '@constants'
import getContext from '@utils/getContext.js'

const { DEFAULT_RESULTS_PER_PAGE } = config

type LogProps = {
    resultsPerPage?: string
    page?: string
    context?: string
    namespace?: string
    search?: string
}

export default async function getLog(req: FastifyRequest, res: FastifyReply) {
    const { log } = req.params as { log: string } || {}
    const {
        resultsPerPage: clientResultsPerPage,
        page,
        context,
        namespace,
        search
    } = req.query as LogProps || {}
    const resultsPerPage = Number(clientResultsPerPage) || DEFAULT_RESULTS_PER_PAGE

    if (log !== 'local' && log !== 'global' || (log === 'local' && (!namespace || !context))) {
        return res.send({
            page,
            resultsPerPage,
            results: [],
            error: "Invalid log parameter (log !== 'local' && log !== 'global' || (log === 'local' && (!namespace || !context)))"
        })
    }

    try {
        const formattedContext = await getContext(context ?? 'prod')
        const isLocal = log === 'local'
        const logQueryFile = isLocal ? 'fetchLocalLog.sql' : 'fetchGlobalLog.sql'
        const logCountQueryFile = isLocal ? 'fetchLocalLogCount.sql' : 'fetchGlobalLogCount.sql'
        const logQueryParameters = isLocal
            ? [Number(page) || 1, resultsPerPage, namespace, search || null, formattedContext]
            : [Number(page) || 1, resultsPerPage, search || null]
        const logCountQueryParameters = isLocal ? [namespace, search || null, formattedContext] : [search || null]
        const logQuery = (await loadSQL(logQueryFile))
        const logCountQuery = (await loadSQL(logCountQueryFile))
        const result = await run(logQuery, logQueryParameters)
        const count = await run(logCountQuery, logCountQueryParameters)
        const pages = Math.ceil((Number(count.rows[0].count) || 1) / resultsPerPage)
        if ((Number(page) || 1) > pages) {
            console.error(`Page does not exist (${page} / ${pages})`)
            return res.send({
                namespace: namespace || 'global',
                context: context || 'global',
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
