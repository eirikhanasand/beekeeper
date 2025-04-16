import getNamespaces from "@utils/fetch/getNamespaces"
import ToolTipsButton from "./toolTipsButton"
import Header from "./header"
import ProdOrDev from "./prodOrDev"

export default async function ServiceList() {
    const services = await getNamespaces('server')
    const headers = new Headers()
    const path = headers.get('x-current-path') || ''

    return (
        <div className='w-full h-full overflow-hidden grid grid-rows-12'>
            <div className="w-full row-span-12 flex flex-col h-full overflow-hidden gap-2">
                <Header />
                <ProdOrDev services={services} currentPath={path} />
                <ToolTipsButton />
            </div>
        </div>
    )
}