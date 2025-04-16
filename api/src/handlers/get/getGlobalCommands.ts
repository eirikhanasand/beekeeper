import { FastifyReply, FastifyRequest } from "fastify"
import run from "../../db.js"

export default async function getGlobalCommands(_: FastifyRequest, res: FastifyReply) {
    try {
        const commands = await run(`SELECT * FROM global_commands`, [])

        return res.send(commands.rows)
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
