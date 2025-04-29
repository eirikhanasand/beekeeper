import getPods from './handlers/pod/get.js'
import getUser from './handlers/user/getUser.js'
import getUsers from './handlers/user/getUsers.js'
import getIndex from './handlers/index/getIndex.js'
import getLogin from './handlers/login/getLogin.js'
import getToken from './handlers/login/getToken.js'
import getHealth from './handlers/index/getHealth.js'
import getVersion from './handlers/index/getVersion.js'
import getContexts from './handlers/context/get.js'
import getCallback from './handlers/login/getCallback.js'
import getLocalCommands from './handlers/command/local/get.js'
import getGlobalCommands from './handlers/command/global/get.js'
import getNamespaces from './handlers/namespace/get.js'
import getNamespaceNotes from './handlers/namespace/note/get.js'
import getNamespaceDomains from './handlers/namespace/domain/get.js'
import getNamespaceDomainsByNamespace from './handlers/namespace/domain/getByNamespace.js'
import getMessages from './handlers/message/get.js'
import getNamespaceIncidents from './handlers/namespace/incident/get.js'
import getIngress from './handlers/ingress/get.js'
import getIngressEvents from './handlers/ingress/events/get.js'
import getLog from './handlers/log/get.js'

import postContext from './handlers/context/post.js'
import postCommand from './handlers/command/post.js'
import postLocalCommand from './handlers/command/local/post.js'
import postGlobalCommand from './handlers/command/global/post.js'
import postNamespace from './handlers/namespace/post.js'
import postNamespaceNote from './handlers/namespace/note/post.js'
import postNamespaceDomain from './handlers/namespace/domain/post.js'
import postNamespaceIncident from './handlers/namespace/incident/post.js'
import postMessage from './handlers/message/post.js'
import postPod from './handlers/pod/post.js'
import postLocalLog from './handlers/log/local/post.js'
import postGlobalLog from './handlers/log/global/post.js'

import putLocalCommand from './handlers/command/local/put.js'
import putGlobalCommand from './handlers/command/global/put.js'
import putNamespaceNote from './handlers/namespace/note/put.js'
import putNamespaceDomain from './handlers/namespace/domain/put.js'
import putNamespaceIncident from './handlers/namespace/incident/put.js'
import putMessage from './handlers/message/put.js'

import deleteLocalCommand from './handlers/command/local/delete.js'
import deleteGlobalCommand from './handlers/command/global/delete.js'
import deleteNamespaceNote from './handlers/namespace/note/delete.js'
import deleteNamespaceDomain from './handlers/namespace/domain/delete.js'
import deleteNamespaceIncident from './handlers/namespace/incident/delete.js'
import deleteMessage from './handlers/message/delete.js'

import { FastifyInstance, FastifyPluginOptions } from "fastify"

export default async function apiRoutes(fastify: FastifyInstance, _: FastifyPluginOptions) {
    // index
    fastify.get("/", getIndex)
    fastify.get('/health', getHealth)
    fastify.get('/version', getVersion)

    // context
    fastify.get('/contexts', getContexts)

    fastify.post('/contexts', postContext)

    // namespace
    fastify.get('/namespaces', getNamespaces)
    fastify.get('/namespaces/notes/:context/:namespace', getNamespaceNotes)
    fastify.get('/namespaces/domains/:context', getNamespaceDomains)
    fastify.get('/namespaces/domains/:context/:namespace', getNamespaceDomainsByNamespace)
    fastify.get('/namespaces/incidents/:context/:namespace', getNamespaceIncidents)
    fastify.get('/namespaces/ingress/:context/:namespace', getIngress)
    fastify.get('/namespaces/ingress/events/:context/:namespace/:name', getIngressEvents)
    
    fastify.post('/namespaces', postNamespace)
    fastify.post('/namespaces/notes', postNamespaceNote)
    fastify.post('/namespaces/domains', postNamespaceDomain)
    fastify.post('/namespaces/incidents', postNamespaceIncident)
    
    fastify.put('/namespaces/notes', putNamespaceNote)
    fastify.put('/namespaces/domains', putNamespaceDomain)
    fastify.put('/namespaces/incidents', putNamespaceIncident)
    
    fastify.delete('/namespaces/notes/:id', deleteNamespaceNote)
    fastify.delete('/namespaces/domains/:id', deleteNamespaceDomain)
    fastify.delete('/namespaces/incidents/:id', deleteNamespaceIncident)
    
    // log
    fastify.get('/log/:log', getLog)
    
    fastify.post('/log/global', postGlobalLog)
    fastify.post('/log/local', postLocalLog)
    
    // command 
    fastify.get('/commands/local', getLocalCommands)
    fastify.get('/commands/global', getGlobalCommands)
    
    fastify.post('/command', postCommand)
    fastify.post('/commands/local', postLocalCommand)
    fastify.post('/commands/global', postGlobalCommand)
    
    fastify.put('/commands/local', putLocalCommand)
    fastify.put('/commands/global', putGlobalCommand)
    
    fastify.delete('/commands/local/:id', deleteLocalCommand)
    fastify.delete('/commands/global/:id', deleteGlobalCommand)
    
    // pod
    fastify.get('/pods', getPods)
    
    fastify.post('/pods', postPod)
    
    // user
    fastify.get('/user/:email', getUser)
    fastify.get('/users', getUsers)
    fastify.get('/token', getToken)
    
    // login
    fastify.get('/login', getLogin)
    fastify.get('/callback', getCallback)
    
    // messages
    fastify.get('/messages', getMessages)

    fastify.post('/messages', postMessage)
    
    fastify.put('/messages', putMessage)
    
    fastify.delete('/messages/:id', deleteMessage)
}
