import getContexts from "./fetch/context/get"

export default async function formattedContexts() {
    const contexts = await getContexts('server')
    const formattedContexts = contexts.map((service) => {
        const name = service.name.split('-')[1]
        const formattedName = `${name[0].toUpperCase()}${name.slice(1)}`
        return formattedName
    })

    return formattedContexts
}