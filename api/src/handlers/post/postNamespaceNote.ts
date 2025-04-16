import { FastifyReply, FastifyRequest } from "fastify"
import run from "../../db.js"

type PostNamespaceBody = { 
    context: string
    name: string
    status: string
    message: string
}

export default async function postNamespaceNote(req: FastifyRequest, res: FastifyReply) {
    const { context, name, status, message } = req.body as PostNamespaceBody || {}
    if (!context || !name || !status || !message) {
        return res.status(400).send({ error: "Missing context, name, status or message." })
    }

    try {
        console.log(`Adding namespace note: context=${context} name=${name}, status=${status}, message=${message}`)

        await run(
            `INSERT INTO namespace_notes (context, name, status, message) 
             SELECT $1, $2, $3, $4;`, 
            [context, name, status, message]
        )

        return res.send({ message: `Successfully added namespace note to notes.` })
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
