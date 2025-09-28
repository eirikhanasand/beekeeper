import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import run from "@db"
import { loadSQL } from "@utils/loadSQL.js"
import config from '@constants'
import getContext from '@utils/getContext.js'

const { DEFAULT_RESULTS_PER_PAGE } = config

type LogProps = {
    resultsPerPage?: string
    page?: string
    context?: string
    namespace?: string
    search?: string
}

export default async function getLog(this: FastifyInstance, req: FastifyRequest, res: FastifyReply) {
    const { log } = req.params as { log: string } || {}
    const {
        resultsPerPage: clientResultsPerPage,
        page,
        context,
        namespace,
        search
    } = req.query as LogProps || {}
    const resultsPerPage = Number(clientResultsPerPage) || DEFAULT_RESULTS_PER_PAGE
    const Page = page && Number(page) > 0 ? Number(page) : 1

    if (log !== 'local' && log !== 'global' || (log === 'local' && (!namespace || !context))) {
        const missingVars = !namespace || !context
        const simple = "Missing context or namespace. This is a local log. Context and namespace is expected."
        const advanced = "Invalid log parameter (log !== 'local' && log !== 'global' || (log === 'local' && (!namespace || !context)))"
        const error = missingVars ? simple : advanced
        return res.send({
            page,
            resultsPerPage,
            results: [],
            error
        })
    }

    try {
        let shouldBeCached = false
        const formattedContext = await getContext(context ?? 'prod')
        const isLocal = log === 'local'
        const logQueryFile = isLocal ? 'fetchLocalLog.sql' : 'fetchGlobalLog.sql'
        const logCountQueryFile = isLocal ? 'fetchLocalLogCount.sql' : 'fetchGlobalLogCount.sql'
        const logQueryParameters = isLocal
        ? [Page, resultsPerPage, namespace, search || null, formattedContext]
        : [Page, resultsPerPage, search || null]
        const logCountQueryParameters = isLocal ? [namespace, search || null, formattedContext] : [search || null]
        const indexedPage = Page - 1
        const pageIsCached = resultsPerPage === 50 
            ? indexedPage < 10
            : resultsPerPage === 100 
                ? indexedPage < 5
                : indexedPage < 20

        if (formattedContext && namespace && pageIsCached && !search) {
            const cacheLength = Object.keys(this.cachedData).length
            if (cacheLength > 0) {
                const cachedNamespace = this.cachedData[formattedContext]?.[namespace]
                if (cachedNamespace) {
                    let cachedPage

                    if (resultsPerPage === 25) {
                        const parentPage = Math.floor(indexedPage / 2)
                        const cachedParentPage = cachedNamespace[parentPage]
                        if (cachedParentPage) {
                            cachedPage = (indexedPage % 2 === 0)
                                ? cachedParentPage.slice(0, 25)
                                : cachedParentPage.slice(25, 50)
                        }
                    } else if (resultsPerPage === 100) {
                        const firstPageIndex = indexedPage * 2
                        const secondPageIndex = firstPageIndex + 1
                        const firstPage = cachedNamespace[firstPageIndex] || []
                        const secondPage = cachedNamespace[secondPageIndex] || []
                        cachedPage = [...firstPage, ...secondPage]
                    } else {
                        cachedPage = cachedNamespace[indexedPage]
                    }
                    return res.send(cachedPage)
                }
            }

            shouldBeCached = true
        }

        const logQuery = (await loadSQL(logQueryFile))
        const logCountQuery = (await loadSQL(logCountQueryFile))
        const result = await run(logQuery, logQueryParameters)
        const count = await run(logCountQuery, logCountQueryParameters)
        const pages = Math.ceil((Number(count.rows[0].count) || 1) / resultsPerPage)
        if (Page > pages) {
            // console.error(`Page does not exist (${Page} / ${pages})`)
            const data = {
                namespace: namespace || 'global',
                context: context || 'global',
                page: Page,
                pages,
                resultsPerPage,
                error: `Page does not exist (${Page} / ${pages})`,
                results: []
            }

            if (shouldBeCached) {
                return res.send({...data, cacheStatus: this.cacheStatus})
            }

            return res.send(data)
        }

        const data = {
            page: Page,
            pages,
            resultsPerPage,
            results: result.rows
        }

        if (shouldBeCached) {
            return res.send({...data, cacheStatus: this.cacheStatus})
        }

        return res.send(data)
    } catch (error) {
        console.log(`Database error: ${JSON.stringify(error)}`)
        return res.status(500).send({ error: "Internal Server Error" })
    }
}
