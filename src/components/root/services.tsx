import { getServices } from "@utils/fetch"
import ToolTipsButton from "./toolTipsButton"
import Header from "./header"
import StudyOrTest from "./prodOrDev"

export default async function ServiceList() {
    // const services = await getServices('server')
    const services = [] as ServiceAsList[]
    const headers = new Headers()
    const path = headers.get('x-current-path') || ''

    return (
        <div className='w-full h-full overflow-hidden grid grid-rows-12'>
            <div className="w-full row-span-12 flex flex-col h-full overflow-hidden gap-2">
                <Header />
                <StudyOrTest services={services} currentPath={path} />
                <ToolTipsButton />
            </div>
        </div>
    )
}