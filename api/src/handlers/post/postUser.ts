import { FastifyReply, FastifyRequest } from "fastify"
import run from "../../db.js"

export default async function postUser(req: FastifyRequest, res: FastifyReply) {
    const { name } = req.body as { name: string } || {}
    if (!name) {
        return res.status(400).send({ error: "Missing username." })
    }

    try {
        console.log(`Adding user: name=${name}`)

        await run(
            `INSERT INTO users (name) 
             SELECT $1
             WHERE NOT EXISTS (SELECT 1 FROM users WHERE name = $1);`, 
            [name]
        )

        return res.send({ message: `Successfully added user ${name}.` })
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
