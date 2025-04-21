import { FastifyReply, FastifyRequest } from "fastify"
import run from "../../../db.js"

type PutNamespaceMessageProps = {
    id: string
    title: string
    author: string
    status: string
    content: string
}

export default async function putNamespaceMessage(req: FastifyRequest, res: FastifyReply) {
    const { id, title, author, status, content } = req.body as PutNamespaceMessageProps || {}
    if (!id || !title || !author || !status || !content) {
        return res.status(400).send({ error: "Missing id, title, author, status, content or timestamp" })
    }

    const exists = await run(`SELECT * FROM namespace_messages WHERE id = $1`, [id])
    if (!exists.rows.length) {
        return res.status(404).send({ error: `Service message ${id} not found.` })
    }

    try {
        console.log(`Updating message: id=${id} status=${status}, content=${content}, author=${author}`)

        await run(
            `UPDATE namespace_messages
            SET title = $2, author = $3, status = $4, content = $5
            WHERE id = $1;`, 
            [id, title, author, status, content]
        )

        return res.send({ message: `Successfully updated message with id ${id}.` })
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
