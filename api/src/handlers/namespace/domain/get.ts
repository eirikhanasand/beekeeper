import { FastifyReply, FastifyRequest } from "fastify"
import run from "@db"

export default async function getNamespaceDomains(req: FastifyRequest, res: FastifyReply) {
    const { context } = req.params as { context: string }
    try {
        const result = await run(
            `SELECT * FROM namespace_domains WHERE context = $1 ORDER BY name;`, 
            [context]
        )

        return res.send(result.rows)
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
