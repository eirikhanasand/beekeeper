import { FastifyReply, FastifyRequest } from "fastify"
import run from "@db"
import { loadSQL } from "@utils/loadSQL.js"
import config from '@constants'

const { DEFAULT_RESULTS_PER_PAGE } = config

export default async function getLog(req: FastifyRequest, res: FastifyReply) {
    const { log } = req.params as { log: string } || {}
    const { resultsPerPage: clientResultsPerPage, page } = req.query as { resultsPerPage: string, page: string } || {}
    const resultsPerPage = Number(clientResultsPerPage) || DEFAULT_RESULTS_PER_PAGE

    if (log !== 'local' && log !== 'global') {
        return res.send({
            page,
            resultsPerPage,
            results: [],
            error: "Invalid log file (log !== 'local' && log !== 'global')"
        })
    }

    const isLocal = log === 'local'

    try {
        const query = await loadSQL(isLocal ? 'fetchLocalLog.sql' : 'fetchGlobalLog.sql')
        const result = await run(query, [Number(page) || 1, resultsPerPage])
        const count = await run("SELECT COUNT(*) FROM local_log;", [])
        const pages = Math.ceil((Number(count.rows[0].count) || 1) / resultsPerPage)
        if ((Number(page) || 1) > pages) {
            console.error(`Page does not exist (${page} / ${pages})`)
            return res.send({
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
