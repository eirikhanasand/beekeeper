
import "fastify"
import type { preloadActivityQueries } from "./handlers/activity/activityQueries"

declare module "fastify" {
    interface FastifyInstance {
        cachedData: Record<string, Record<string, any[]>>
        cacheStatus: number
    }
}
