import { FastifyReply, FastifyRequest } from "fastify"
import run from "../../db.js"
import tokenWrapper from "../../utils/tokenWrapper.js"

export default async function postContext(req: FastifyRequest, res: FastifyReply) {
    const { name, cluster, authinfo, namespace } = req.body as { name: string, cluster: string, authinfo: string, namespace: string } || {}
    const { valid } = await tokenWrapper(req, res)
    if (!valid) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    if (!name || !cluster || !authinfo || !namespace) {
        return res.status(400).send({ error: "Missing name, cluster, authinfo or namespace." })
    }

    try {
        console.log(`Adding context: name=${name}, cluster=${cluster}, authinfo=${authinfo}, namespace=${namespace}`)

        await run(
            `INSERT INTO contexts (name, cluster, authinfo, namespace) 
             SELECT $1, $2, $3, $4
             WHERE NOT EXISTS (SELECT 1 FROM contexts WHERE name = $1);`, 
            [name, cluster, authinfo, namespace]
        )

        return res.send({ message: `Successfully added context ${name} to contexts.` })
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
