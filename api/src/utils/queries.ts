import { FastifyInstance } from 'fastify'
import getContexts from './getContexts.js'
import getLocalLogForContextNamespaceCache from './getLocalLogForContextNamespaceCache.js'
import getNamespaces from './getNamespaces.js'
import sleep from './sleep.js'

export async function preloadFirstTenPagesOfLocalLogForEachNamespace(fastify: FastifyInstance) {
    const data: Record<string, Record<string, any[]>> = {}
    const contexts = await getContexts()
    const namespaces = await getNamespaces()
    const totalTasks = contexts.length * namespaces.length
    let completedTasks = 0

    for (const context of contexts) {
        data[context] = {}
        for (const namespace of namespaces) {
            data[context][namespace] = await getLocalLogForContextNamespaceCache(context, namespace)
            completedTasks++
            const percentage = Number(((completedTasks / totalTasks) * 100).toFixed(1))
            if (!Object.keys(fastify.cachedData).length) {
                if (percentage > fastify.cacheStatus) {
                    fastify.cacheStatus = percentage
                }
                // console.log(`Progress: ${percentage}% (${completedTasks}/${totalTasks})`)
            }
            // await sleep(1000)
        }
    }

    return data
}
