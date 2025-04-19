import getContexts from "./getContexts"

export default async function getFormattedContexts() {
    const contexts = await getContexts('server')
    const formattedContexts = contexts.map((service) => {
        const name = service.name.split('-')[1]
        const formattedName = `${name[0].toUpperCase()}${name.slice(1)}`
        return formattedName
    })

    return formattedContexts
}