import { FastifyReply, FastifyRequest } from "fastify"
import run from "../../db.js"

export default async function getNamespaces(_: FastifyRequest, res: FastifyReply) {
    try {
        const result = await run(`SELECT * FROM namespaces ORDER BY name ASC`, [])

        return res.send(result.rows)
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
