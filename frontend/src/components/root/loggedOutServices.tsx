import getNamespaces from "@/utils/fetch/namespace/get"
import getLogs from "@/utils/fetch/log/get"
import Pulse from "./pulse"
import worstAndBestServiceStatus from "../services/worstAndBestServiceStatus"
import serviceStatus from "../services/serviceStatus"

export default async function LoggedOutServices() {
    const services = await getNamespaces('server')
    const { meta } = await worstAndBestServiceStatus()
    const localLog = await getLogs('server', 'local', 1) as LocalLog[]
    const filteredServices = services.filter(service => {
        return service.context.includes('prod')
    })
    const serviceStyle = `
        flex flex-row px-[1rem] items-center gap-[0.5rem] py-[0.8rem] 
        hover:pl-[1.5rem] duration-[500ms] transition-[padding] cursor-not-allowed
        hover:*:fill-login hover:text-login font-medium justify-between
    `

    return (
        <div className='w-full h-full overflow-hidden grid grid-rows-12'>
            <div className="w-full row-span-12 flex flex-col h-full overflow-hidden gap-2">
                <div className="bg-darker p-2 rounded-xl w-full h-[7vh]">
                    <div className="grid place-items-center overflow-hidden h-10 rounded-xl">
                        <Pulse
                            innerWidth="w-[93%] p-2 grid place-items-center text-center" 
                            innerHeight="h-6"
                            outerWidth="w-full rounded-xl"
                            outerHeight="h-7"
                            status={meta}
                        >
                            <h1 className="w-full text-light">Overall status</h1>
                        </Pulse>
                    </div>
                </div>
                <div className="h-full bg-darker rounded-xl overflow-auto max-h-full noscroll">
                    {filteredServices.map(async(service) => {
                        const status = await serviceStatus(localLog, service)

                        return (
                            <div key={service.name} className={serviceStyle}>
                                <h1>{service.name}</h1>
                                <Pulse status={status} />
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}
