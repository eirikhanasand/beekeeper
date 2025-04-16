type ServiceProps = {
    service: ServiceAsList
    currentPath: string
}

type Editing = {
    cards: Card[]
    texts: string[]
}

type Service = {
    id: string
    cards: Card[]
    unreviewed: Card[]
    textUnreviewed: string[]
    mark?: boolean
}

type ServiceAsList = {
    context: string
    name: string
    status: string
    service_status: string
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

type Log = {
    id: string
    name: string
    event: string
    status: string
    command: string 
    timestamp: string
}
