import { FastifyReply, FastifyRequest } from "fastify"
import config from '@constants'

const { USER_ENDPOINT, AUTHENTIK_TOKEN } = config

type Data = {
    results: Array<any>
}

export default async function getUser(req: FastifyRequest, res: FastifyReply) {
    const { email } = req.params as { email: string }
    if (!email) {
        return res.status(400).send({ error: "Missing ID." })
    }

    try {
        const response = await fetch(`${USER_ENDPOINT}?email=${email}`, {
            headers: {
                'Authorization': `Bearer ${AUTHENTIK_TOKEN}`,
                'Content-Type': 'application/json'
            }
        })
        if (!response.ok) {
            throw new Error(await response.text())
        }

        const data = await response.json() as Data
        if ('results' in data && data.results.length) {
            return res.send(data.results[0])
        }

        return res.status(400).send({ error: 'User not found' })
    } catch (error) {
        console.error(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
