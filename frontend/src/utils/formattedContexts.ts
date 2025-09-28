import config from '@/constants'
import getContexts from "./fetch/context/get"

export default function formattedContexts(name: string): Promise<string>;
export default function formattedContexts(): Promise<string[]>;

export default async function formattedContexts(name?: string): Promise<string | string[]> {
    const contexts = await getContexts('server')
    const formattedContexts = contexts.map((service) => {
        const name = service.name.split('-')[1]
        const formattedName = `${name[0].toUpperCase()}${name.slice(1)}`
        return formattedName
    })

    const namedContext = formattedContexts.find((context) => context.includes(name || config.DEFAULT_CLUSTER)) || config.DEFAULT_CLUSTER

    return name ? namedContext : formattedContexts
}
