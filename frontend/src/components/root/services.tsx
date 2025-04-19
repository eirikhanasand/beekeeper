import getNamespaces from "@/utils/fetch/get/getNamespaces"
import ToolTipsButton from "./toolTipsButton"
import Header from "./header"
import ProdOrDev from "./prodOrDev"
import { headers } from "next/headers"

export default async function Services() {
    const services = await getNamespaces('server')
    const Headers = await headers()
    const path = Headers.get('x-current-path') || ''

    return (
        <div className='w-full h-full overflow-hidden grid grid-rows-12'>
            <div className="w-full row-span-12 flex flex-col h-full overflow-hidden gap-2">
                <Header path={path} />
                <ProdOrDev services={services} path={path} />
                <ToolTipsButton />
            </div>
        </div>
    )
}