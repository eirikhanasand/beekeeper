import { FastifyReply, FastifyRequest } from "fastify"
import run from "../../db.js"

export default async function getNamespaceDomains(req: FastifyRequest, res: FastifyReply) {
    const { context, namespace } = req.params as { context: string, namespace: string }
    try {
        const result = await run(
            `SELECT * FROM namespace_domains WHERE context = $1 AND namespace = $2 ORDER BY name;`, 
            [context, namespace]
        )

        return res.send(result.rows)
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
