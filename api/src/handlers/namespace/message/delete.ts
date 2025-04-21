import { FastifyReply, FastifyRequest } from "fastify"
import run from "../../../db.js"
import tokenWrapper from "../../../utils/tokenWrapper.js"

export default async function deleteNamespaceMessage(req: FastifyRequest, res: FastifyReply) {
    const { id } = req.params as { id: string }
    const { valid } = await tokenWrapper(req, res)
    if (!valid) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    try {
        const result = await run(`DELETE FROM namespace_messages WHERE id = $1`, [id])

        return res.send(result.rows)
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
