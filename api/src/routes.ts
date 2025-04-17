import getVersion from './handlers/get/getVersion'
import getContexts from './handlers/get/getContexts'
import getGlobalCommands from './handlers/get/getGlobalCommands'
import getHealth from './handlers/get/getHealth'
import getIndex from './handlers/get/getIndex'
import getLocalCommands from './handlers/get/getLocalCommands'
import getNamespaceNotes from './handlers/get/getNamespaceNotes'
import getNamespaces from './handlers/get/getNamespaces'
import getPods from './handlers/get/getPods'
import getUsers from './handlers/get/getUsers'
import getUser from './handlers/get/getUser'
import getLocalLog from './handlers/get/getLocalLog'
import getGlobalLog from './handlers/get/getGlobalLog'

import postContext from './handlers/post/postContext'
import postGlobalCommand from './handlers/post/postGlobalCommand'
import postLocalCommand from './handlers/post/postLocalCommand'
import postNamespace from './handlers/post/postNamespace'
import postNamespaceNote from './handlers/post/postNamespaceNote'
import postPod from './handlers/post/postPod'
import postUser from './handlers/post/postUser'
import postGlobalLog from './handlers/post/postGlobalLog'
import postLocalLog from './handlers/post/postLocalLog'

import runCommand from './handlers/post/runCommand'

import { FastifyInstance, FastifyPluginOptions } from "fastify"
import getLogin from './handlers/get/getLogin'
import { getCallback } from './handlers/get/getCallback'
import getToken from './handlers/get/getToken'

export default async function apiRoutes(fastify: FastifyInstance, _: FastifyPluginOptions) {
    // GET handlers
    fastify.get("/", getIndex)
    fastify.get('/health', getHealth)
    fastify.get('/contexts', getContexts)
    fastify.get('/commands/global', getGlobalCommands)
    fastify.get('/commands/local', getLocalCommands)
    fastify.get('/log/local', getLocalLog)
    fastify.get('/log/global', getGlobalLog)
    fastify.get('/namespaces/notes', getNamespaceNotes)
    fastify.get('/namespaces', getNamespaces)
    fastify.get('/pods', getPods)
    fastify.get('/user/:name', getUser)
    fastify.get('/users', getUsers)
    fastify.get('/login', getLogin)
    fastify.get('/callback', getCallback)
    fastify.get('/version', getVersion)
    fastify.get('/token', getToken)

    // POST handlers
    fastify.post('/contexts', postContext)
    fastify.post('/command', runCommand)
    fastify.post('/commands/global', postGlobalCommand)
    fastify.post('/commands/local', postLocalCommand)
    fastify.post('/log/global', postGlobalLog)
    fastify.post('/log/local', postLocalLog)
    fastify.post('/namespaces', postNamespace)
    fastify.post('/namespaces/notes', postNamespaceNote)
    fastify.post('/pods', postPod)
    fastify.post('/user', postUser)

    // PUT handlers 
    // fastify.put("/list/:list", listPutHandler)
    // router.put('/course/:courseID', putCourse) 
    // router.put('/time', putTime)
    // router.put('/score', putScore)
    // router.put('/text', putText)
    // router.put('/mark', putMarkCourse)
    // router.put('/file', putFile)

    // DELETE handlers
}
