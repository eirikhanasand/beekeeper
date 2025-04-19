import Link from "next/link"
import Edit from "./edit"
import Global from "./global"
import getFormattedContexts from "@/utils/formattedContexts"
import getSegmentedPathname from "@/utils/pathname"
import getNamespaces from "@/utils/fetch/namespace/get"

type HeaderProps = {
    path: string
}

type ContextProps = {
    context: string
    service: string
    activeContext: string
}

export default async function Header({path}: HeaderProps) {
    const segmentedPathname = getSegmentedPathname(path)
    const contexts = await getFormattedContexts()
    const service = segmentedPathname[2] || ''
    const activeContext = segmentedPathname[1]
    const cols = `grid-cols-${contexts.length}`

    return (
        <div className="bg-darker p-2 rounded-xl">
            <div className={`grid ${cols} gap-2 justify-items-center pb-2`}>
                {contexts.map((context) => <Context 
                    key={context}
                    context={context || 'prod'} 
                    service={service || 'global'} 
                    activeContext={activeContext || 'prod'} 
                />)}
            </div>
            <ServiceHeader />
        </div>
    )
}

function Context({context, service, activeContext}: ContextProps) {
    const active = context.toLowerCase() === activeContext.toLowerCase()
    return (
        <Link
            href={`/service/${context.toLowerCase()}/${service ? service : 'global'}`}
            className={`${active && service === 'global' ? 'cursor-not-allowed' : ''} ${active ? "bg-normal" : "bg-light"} w-full rounded-lg w-full px-2 content-center text-almostbright flex text-lg`}
        >
            <h1 className="xl:mr-1">≡</h1>
            <h1 className="hidden xl:grid text-base place-self-center">{context}</h1>
        </Link>
    )
}

async function ServiceHeader() {
    const services = await getNamespaces('server')
    return (
        <div className="flex flex-cols gap-2">
            <h1 className="text-lg">Services</h1>
            <Edit services={services} />
            <Global />
        </div>
    )
}
