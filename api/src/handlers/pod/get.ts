import { FastifyReply, FastifyRequest } from "fastify"
import run from "@db"

export default async function getPods(_: FastifyRequest, res: FastifyReply) {
    try {
        const result = await run(`SELECT * FROM pods ORDER BY name ASC`)
        return res.send(result.rows)
    } catch (error) {
        console.log(`Database error in getPods: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
