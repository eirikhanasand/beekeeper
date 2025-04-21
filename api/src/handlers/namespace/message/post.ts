import { FastifyReply, FastifyRequest } from "fastify"
import run from "../../../db.js"
import tokenWrapper from "../../../utils/tokenWrapper.js"

type PostNamespaceNoteProps = { 
    title: string
    author: string
    status: string
    content: string
}

export default async function postNamespaceMessage(req: FastifyRequest, res: FastifyReply) {
    const { title, author, status, content } = req.body as PostNamespaceNoteProps || {}
    const { valid } = await tokenWrapper(req, res)
    if (!valid) {
        return res.status(400).send({ error: "Unauthorized" })
    }

    if (!title || !author || !status || !content) {
        return res.status(400).send({ error: "Missing title, author, status or content" })
    }

    try {
        console.log(`Adding namespace message: title=${title} author=${author}, status=${status}, content=${content}`)

        await run(
            `INSERT INTO namespace_messages (title, author, status, content) 
             SELECT $1, $2, $3, $4;`, 
            [title, author, status, content]
        )

        return res.send({ message: `Successfully added message ${title}.` })
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
