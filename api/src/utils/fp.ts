import fp from 'fastify-plugin'
import { preloadFirstTenPagesOfLocalLogForEachNamespace } from './queries.js'
import alertSlowQuery from './alertSlowQuery.js'
import config from '@constants'

export default fp(async (fastify) => {
    async function refreshQueries() {
        console.log('Heap before:', process.memoryUsage().heapUsed / 1024 / 1024, 'MB')
        const start = Date.now()
        const newData = await preloadFirstTenPagesOfLocalLogForEachNamespace(fastify)
        const jsonString = JSON.stringify(newData)
        console.log(jsonString)
        const bytes = new TextEncoder().encode(jsonString).length
        const megabytes = bytes / (1024 * 1024)
        console.log(`MB cached: ${megabytes}`)
        fastify.cachedData = newData
        console.log('Heap after:', process.memoryUsage().heapUsed / 1024 / 1024, 'MB')
        const duration = (Date.now() - start) / 1000
        alertSlowQuery(duration, 'cache')
        fastify.log.info('Context-namespace cache refreshed')
    }

    refreshQueries()
    setInterval(refreshQueries, config.CACHE_TTL)
})
