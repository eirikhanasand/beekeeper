import { FastifyReply, FastifyRequest } from "fastify"
import tokenWrapper from "@utils/tokenWrapper.js"

export default async function getToken(req: FastifyRequest, res: FastifyReply) {
    const response = await tokenWrapper(req, res)
    if (!response.valid) {
        return res.status(400).send(response)
    }

    return res.status(200).send(response)
}
