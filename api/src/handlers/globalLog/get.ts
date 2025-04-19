import { FastifyReply, FastifyRequest } from "fastify"
import run from "../../db.js"

export default async function getGlobalLog(_: FastifyRequest, res: FastifyReply) {
    try {
        const log = await run(`SELECT * FROM global_log ORDER BY timestamp DESC`, [])

        return res.send(log.rows)
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
