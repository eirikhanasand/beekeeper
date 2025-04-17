import { FastifyReply, FastifyRequest } from "fastify"
import config from "../../constants"

const { USERINFO_URL } = config

export default async function getToken(req: FastifyRequest, res: FastifyReply) {
    const authHeader = req.headers['authorization']

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).send({ 
            valid: false, 
            error: 'Missing or invalid Authorization header' 
        })
    }

    const token = authHeader.split(' ')[1]

    try {
        const userInfoRes = await fetch(USERINFO_URL, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        if (!userInfoRes.ok) {
            return res.status(401).send({ 
                valid: false, 
                error: 'Invalid token'
            })
        }

        // const userInfo = await userInfoRes.json()
        // console.log(userInfo)

        return res.status(200).send({ 
            valid: true
        })
    } catch (err) {
        res.log.error(err)
        return res.status(500).send({ 
            valid: false, 
            error: 'Internal server error'
        })
    }
}