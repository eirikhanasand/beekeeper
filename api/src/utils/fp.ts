import fp from 'fastify-plugin'
import { preloadFirstTenPagesOfLocalLogForEachNamespace } from './queries.js'

export default fp(async (fastify) => {
    async function refreshQueries() {
        const newData = await preloadFirstTenPagesOfLocalLogForEachNamespace(fastify)
        const jsonString = JSON.stringify(newData)
        const bytes = new TextEncoder().encode(jsonString).length
        const megabytes = bytes / (1024 * 1024)
        console.log(`MB cached: ${megabytes}`)
        fastify.cachedData = newData
        fastify.log.info('Context-namespace cache refreshed')
    }

    refreshQueries()
    setInterval(refreshQueries, 60000)
})
