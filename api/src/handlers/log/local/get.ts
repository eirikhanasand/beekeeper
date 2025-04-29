import { FastifyReply, FastifyRequest } from "fastify"
import run from "@db"
import { loadSQL } from "@utils/loadSQL.js"
import config from '@constants'

const { DEFAULT_RESULTS_PER_PAGE } = config

export default async function getLocalLog(req: FastifyRequest, res: FastifyReply) {
    const { resultsPerPage: clientResultsPerPage, page } = req.query as { resultsPerPage: string, page: string } || {}
    const resultsPerPage = Number(clientResultsPerPage) || DEFAULT_RESULTS_PER_PAGE

    try {
        const query = await loadSQL('fetchLocalLog.sql')
        const log = await run(query, [resultsPerPage, Number(page) || 1])

        return res.send(log.rows)
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
