import { FastifyReply, FastifyRequest } from "fastify"
import run from "../../db.js"

export default async function deleteGlobalCommand(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string }
    try {
        const result = await run(`DELETE FROM global_commands WHERE id = $1`, [id])

        return res.send(result.rows)
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
