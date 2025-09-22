import config from '@constants'
import { loadSQL } from './loadSQL.js'
import run from '@db'

export default async function getLocalLogForContextNamespaceCache(context: string, namespace: string) {
    const data = []
    for (let i = 1; i <= 10; i++) {
        const page = await getPageOfLocalLogForContextNamespaceCache(i, context, namespace)
        if (!('error' in page))
        data.push(page)
    }

    return data
}

export async function getPageOfLocalLogForContextNamespaceCache(page: number, context: string, namespace: string) {
    const resultsPerPage = config.DEFAULT_RESULTS_PER_PAGE
    const search = null
    const isLocal = true
    const logQueryFile = isLocal ? 'fetchLocalLog.sql' : 'fetchGlobalLog.sql'
    const logCountQueryFile = isLocal ? 'fetchLocalLogCount.sql' : 'fetchGlobalLogCount.sql'
    const logQueryParameters = isLocal
        ? [Number(page) || 1, resultsPerPage, namespace, search, context]
        : [Number(page) || 1, resultsPerPage, search || null]
    const logCountQueryParameters = isLocal ? [namespace, search, context] : [search]
    const logQuery = (await loadSQL(logQueryFile))
    const logCountQuery = (await loadSQL(logCountQueryFile))
    const result = await run(logQuery, logQueryParameters)
    const count = await run(logCountQuery, logCountQueryParameters)
    const pages = Math.ceil((Number(count.rows[0].count) || 1) / resultsPerPage)
    if ((Number(page) || 1) > pages) {
        const error = `Page ${page} does not exist for namespace ${namespace} in cluster ${context} (${page} / ${pages})`
        console.log(error)
        return {
            namespace: namespace || 'global',
            context: context || 'global',
            page,
            pages,
            resultsPerPage,
            error,
            results: []
        }
    }

    return {
        page,
        pages,
        resultsPerPage,
        results: result.rows
    }
}
