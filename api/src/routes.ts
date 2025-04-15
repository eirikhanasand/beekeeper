// Imports all GET handlers from the handlers folder
import { 
    getIndexHandler, 
    getHealthHandler,
    // getCallback,
    // getLogin,
    getVersion
} from './handlers/get'

// Imports all POST handlers from the handlers folder
// import { 
//     postFile, 
//     postRegister, 
//     postLogin, 
//     postCard, 
//     postCourse, 
//     postComment, 
//     postVote, 
//     postCardVote 
// } from './handlers/post'

// Imports all PUT handlers from the handlers folder
// import { 
//     putCourse, 
//     putText, 
//     putMarkCourse, 
//     putFile,
//     putTime,
//     putScore
// } from './handlers/put'

import { FastifyInstance, FastifyPluginOptions } from "fastify"

export default async function apiRoutes(fastify: FastifyInstance, _: FastifyPluginOptions) {
    // GET handlers
    fastify.get("/", getIndexHandler)
    fastify.get('/health', getHealthHandler)
    // fastify.get('/login', getLogin)
    // fastify.get('/callback', getCallback)
    fastify.get('/version', getVersion)

    // POST handlers
    // fastify.post("/list/:list", listPostHandler)
    // fastify.post("/worker", workerPostHandler)
    // router.post('/file', postFile)
    // router.post('/register', postRegister)
    // router.post('/login', postLogin)
    // router.post('/upload_card', postCard)
    // router.post('/upload_course', postCourse)
    // router.post('/comment', postComment)
    // router.post('/vote', postVote)
    // router.post('/vote/card', postCardVote)

    // PUT handlers 
    // fastify.put("/list/:list", listPutHandler)
    // router.put('/course/:courseID', putCourse) 
    // router.put('/time', putTime)
    // router.put('/score', putScore)
    // router.put('/text', putText)
    // router.put('/mark', putMarkCourse)
    // router.put('/file', putFile)
}
