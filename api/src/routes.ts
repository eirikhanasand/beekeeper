import getPods from './handlers/pod/get'
import getUser from './handlers/user/getUser'
import getUsers from './handlers/user/getUsers'
import getIndex from './handlers/index/getIndex'
import getLogin from './handlers/login/getLogin'
import getToken from './handlers/login/getToken'
import getHealth from './handlers/index/getHealth'
import getVersion from './handlers/index/getVersion'
import getContexts from './handlers/context/get'
import getCallback from './handlers/login/getCallback'
import getLocalLog from './handlers/log/local/get'
import getGlobalLog from './handlers/log/global/get'
import getLocalCommands from './handlers/command/local/get'
import getGlobalCommands from './handlers/command/global/get'
import getNamespaces from './handlers/namespace/get'
import getNamespaceNotes from './handlers/namespace/note/get'
import getNamespaceDomains from './handlers/namespace/domain/get'
import getNamespaceDomainsByNamespace from './handlers/namespace/domain/getByNamespace'
import getMessages from './handlers/message/get'
import getNamespaceIncidents from './handlers/namespace/incident/get'
import getIngress from './handlers/ingress/get'

import postContext from './handlers/context/post'
import postCommand from './handlers/command/post'
import postLocalCommand from './handlers/command/local/post'
import postGlobalCommand from './handlers/command/global/post'
import postNamespace from './handlers/namespace/post'
import postNamespaceNote from './handlers/namespace/note/post'
import postNamespaceDomain from './handlers/namespace/domain/post'
import postNamespaceIncident from './handlers/namespace/incident/post'
import postMessage from './handlers/message/post'
import postPod from './handlers/pod/post'
import postLocalLog from './handlers/log/local/post'
import postGlobalLog from './handlers/log/global/post'

import putLocalCommand from './handlers/command/local/put'
import putGlobalCommand from './handlers/command/global/put'
import putNamespaceNote from './handlers/namespace/note/put'
import putNamespaceDomain from './handlers/namespace/domain/put'
import putNamespaceIncident from './handlers/namespace/incident/put'
import putMessage from './handlers/message/put'

import deleteLocalCommand from './handlers/command/local/delete'
import deleteGlobalCommand from './handlers/command/global/delete'
import deleteNamespaceNote from './handlers/namespace/note/delete'
import deleteNamespaceDomain from './handlers/namespace/domain/delete'
import deleteNamespaceIncident from './handlers/namespace/incident/delete'
import deleteMessage from './handlers/message/delete'

import { FastifyInstance, FastifyPluginOptions } from "fastify"
import getIngressEvents from './handlers/ingress/events/get'

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
    fastify.get('/log/local', getLocalLog)
    fastify.get('/log/global', getGlobalLog)
    
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
