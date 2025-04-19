type ServiceProps = {
    service: ServiceAsList
    segmentedPathname: string[]
    context: string
    localLog: Log[]
}

type Editing = {
    cards: Card[]
    texts: string[]
}

type ServiceAsList = {
    context: string
    name: string
    status: string
    service_status: 'operational' | 'degraded' | 'down'
    age: string
}

type Card = {
    question: string
    alternatives: string[]
    source: string
    correct: number[]
    help?: string
    theme?: string
    rating: number
    votes: Vote[]
}

type CardAsText = {
    input: string
}

type Vote = {
    username: string
    vote: boolean
}

type Files = {
    name: string
    content: string
    files: Files[]
    parent?: string
}

type FileListProps = {
    files: Files[]
    path: string
    inputRef: RefObject<HTMLInputElement | null>
}

type ClientVote = {
    commentID: number
    vote: boolean
    isReply?: true
}

type RegisterUser = {
    id: string
    name: string
    username: string
}

type LocalLog = {
    context: string
    namespace: string
    id: string
    name: string
    event: string
    status: string
    command: string 
    timestamp: string
}

type GlobalLog = {
    id: string
    name: string
    event: string
    status: string
    command: string 
    timestamp: string
}

type Context = {
    name: string
    cluster: string
    authinfo: string
    namespace: string
}

type GlobalCommand = {
    id: string
    name: string
    command: string
    author: string
    reason: string
    timestamp: string
}

type LocalCommand = {
    id: string
    context: string
    name: string
    namespace: string
    command: string
    author: string
    reason: string
    timestamp: string
}

type User = {
    pk: number
    username: string
    name: string
    is_active: boolean
    last_login: string
    is_superuser: boolean
    groups: string[]
    groups_obj: Group[]
    email: string
    avatar: string
    attributes: {}
    uid: string
    path: string
    type: string
    uuid: string
    password_change_date: string
}

type Group = {
    pk: string
    num_pk: number
    name: string
    is_superuser: boolean
    parent: string | null
    parent_name: string | null
    attributes: {}
}

type GlobalCommandWithUser = {
    id: string
    name: string
    command: string
    author: User
    reason: string
    timestamp: string
}

type LocalCommandWithUser = {
    id: string
    context: string
    name: string
    namespace: string
    command: string
    author: User
    reason: string
    timestamp: string
}
