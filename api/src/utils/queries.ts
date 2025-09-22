import { FastifyInstance } from 'fastify'
import getContexts from './getContexts.js'
import getLocalLogForContextNamespaceCache from './getLocalLogForContextNamespaceCache.js'
import getNamespaces from './getNamespaces.js'

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
            const percentage = ((completedTasks / totalTasks) * 100).toFixed(1)
            if (!Object.keys(fastify.cachedData).length) {
                fastify.cacheStatus = percentage
                // console.log(`Progress: ${percentage}% (${completedTasks}/${totalTasks})`)
            }
        }
    }

    return data
}
