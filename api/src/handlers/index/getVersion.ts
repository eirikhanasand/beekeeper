import config from "../../../package.json" with { type: 'json' }
import { FastifyReply, FastifyRequest } from 'fastify'

export default function getVersion(_: FastifyRequest, res: FastifyReply): any {
    return res.send(config.version)
}
