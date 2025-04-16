import { FastifyReply, FastifyRequest } from "fastify"
import run from "../../db.js"

export default async function getUser(req: FastifyRequest, res: FastifyReply) {
    const { name } = req.params as { name: string }

    if (!name) {
        return res.status(400).send({ error: "Missing username in parameters." })
    }

    try {
        const result = await run(`SELECT * FROM users WHERE name = $1`, [name])

        if (result.rows.length === 0) {
            return res.status(404).send({ error: `User '${name}' not found.` })
        }

        return res.send(result.rows[0])
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
