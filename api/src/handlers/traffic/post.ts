import { FastifyReply, FastifyRequest } from "fastify"
import run from "@db"
import debug from '@utils/debug.js'
import config from "@constants"

type PostTrafficBody = {
    ip: string
    user_agent: string
    domain: string
    path: string
    method: string
    referer: string
    timestamp: number
}

export default async function postTraffic(req: FastifyRequest, res: FastifyReply) {
    const allowedIPs = ['127.0.0.1', '::1']
    const clientIP = req.ip || ''
    const secret = config.TRAFFIC_SECRET || ''
    const providedSecret = req.headers['x-traffic-secret']

    if (!allowedIPs.includes(clientIP) || providedSecret !== secret) {
        return res.status(403).send({ error: "Forbidden" })
    }

    const { ip, user_agent, domain, path, method, referer, timestamp } = req.body as PostTrafficBody || {}

    if (!ip || !user_agent || !domain || !path || !method || !referer || timestamp === undefined) {
        return res.status(400).send({ error: "Missing required fields." })
    }

    try {
        const ts = new Date(timestamp * 1000).toISOString()

        await run(
            `INSERT INTO traffic (ip, user_agent, domain, path, method, referer, timestamp) 
             VALUES ($1, $2, $3, $4, $5, $6, $7);`,
            [ip, user_agent, domain, path, method, referer, ts]
        )

        return res.send({ message: "Traffic logged successfully." })
    } catch (error) {
        debug({ basic: `Database error in postTraffic: ${JSON.stringify(error)}` })
        return res.status(500).send({ error: "Internal Server Error" })
    }
}