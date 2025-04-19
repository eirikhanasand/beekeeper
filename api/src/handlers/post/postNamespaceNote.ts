import { FastifyReply, FastifyRequest } from "fastify"
import run from "../../db.js"
import tokenWrapper from "../../utils/tokenWrapper.js"

type PostNamespaceNoteProps = { 
    context: string
    namespace: string
    status: string
    message: string
    author: string
}

export default async function postNamespaceNote(req: FastifyRequest, res: FastifyReply) {
    const { context, namespace, status, message, author } = req.body as PostNamespaceNoteProps || {}
    const { valid } = await tokenWrapper(req, res)
    if (!valid) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    if (!context || !namespace || !status || !message || !author) {
        return res.status(400).send({ error: "Missing context, namespace, status, message or author." })
    }

    try {
        console.log(`Adding namespace note: context=${context} namespace=${namespace}, status=${status}, message=${message} author=${author}`)

        await run(
            `INSERT INTO namespace_notes (context, name, status, message) 
             SELECT $1, $2, $3, $4;`, 
            [context, namespace, status, message, author]
        )

        return res.send({ message: `Successfully added namespace note to notes.` })
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
