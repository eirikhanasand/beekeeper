import { FastifyReply, FastifyRequest } from "fastify"
import tokenWrapper from "@utils/tokenWrapper.js"
import discordAlert from "@utils/discordAlert.js"

export default async function getToken(req: FastifyRequest, res: FastifyReply) {
    const response = await tokenWrapper(req, res)
    if (!response.valid) {
        discordAlert('A user has failed to access the system using the break-the-glass account. Immediate attention may be required.')
        return res.status(400).send(response)
    }

    discordAlert('A user has successfully accessed the system using the break-the-glass account. Immediate attention may be required.')
    return res.status(200).send(response)
}
