import cors from '@fastify/cors'
import Fastify from 'fastify'
import apiRoutes from './routes'
import { getIndexHandler } from './handlers/get'

const fastify = Fastify({
    logger: true
})

fastify.register(cors, {
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'HEAD']
})

// Configures the port for the server, uses environment variable if defined, otherwise defaults to 8080
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