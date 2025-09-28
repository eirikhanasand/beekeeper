import { FastifyReply, FastifyRequest } from "fastify"
import run from "@db"

export default async function getUsers(_: FastifyRequest, res: FastifyReply) {
    try {
        const result = await run(`SELECT * FROM users ORDER BY name ASC`)

        return res.send(result.rows)
    } catch (error) {
        console.log(`Database error in getUsers: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
