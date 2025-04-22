import { FastifyReply, FastifyRequest } from "fastify"
import run from "../../db.js"

export default async function getMessages(_: FastifyRequest, res: FastifyReply) {
    try {
        const result = await run(
            `SELECT * FROM messages ORDER BY timestamp DESC`,
            []
        )

        return res.send(result.rows)
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
