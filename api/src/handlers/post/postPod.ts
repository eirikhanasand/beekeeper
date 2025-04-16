import { FastifyReply, FastifyRequest } from "fastify"
import run from "../../db.js"

export default async function postPod(req: FastifyRequest, res: FastifyReply) {
    const { name } = req.body as { name: string } || {}
    if (!name) {
        return res.status(400).send({ error: "Missing pod name." })
    }

    try {
        console.log(`Adding pod: name=${name}`)

        await run(
            `INSERT INTO pods (name) 
             SELECT $1
             WHERE NOT EXISTS (SELECT 1 FROM pods WHERE name = $1);`, 
            [name]
        )

        return res.send({ message: `Successfully added pod ${name}.` })
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
