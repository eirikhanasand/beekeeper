import { FastifyReply, FastifyRequest } from "fastify"
import run from "@db"

export default async function getLocalCommands(_: FastifyRequest, res: FastifyReply) {
    try {
        const commands = await run(`SELECT * FROM local_commands`)

        return res.send(commands.rows)
    } catch (error) {
        console.log(`Database error in getLocalCommands: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
