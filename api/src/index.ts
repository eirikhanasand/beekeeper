import cors from '@fastify/cors'
import Fastify from 'fastify'
import apiRoutes from './routes.js'
import getIndexHandler from './handlers/index/getIndex.js'

const fastify = Fastify({
    logger: true
})

fastify.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD']
})

const port = Number(process.env.PORT) || 8080

fastify.register(apiRoutes, { prefix: "/api" })
fastify.get('/', getIndexHandler)

async function start() {
    try {
        await fastify.listen({ port, host: '0.0.0.0' })
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

start()
