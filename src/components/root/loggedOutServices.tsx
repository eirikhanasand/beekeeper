import getNamespaces from "@utils/fetch/getNamespaces"
import getLogs from "@/utils/fetch/getLogs"
import { ServiceStatus } from "@parent/interfaces"
import Pulse from "../pulse"

export default async function LoggedOutServices() {
    const services = await getNamespaces('server')
    const logs = await getLogs('server', 'global')
    const isDegraded = logs.find((log) => log.status !== 'operational')
    const isDown = services.find((service) => service.service_status !== 'operational' && service.service_status !== 'degraded')
    const status = isDown 
        ? ServiceStatus.DOWN 
        : isDegraded 
            ? ServiceStatus.DEGRADED 
            : ServiceStatus.OPERATIONAL

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
                            innerWidth="w-[94%] p-2 grid place-items-center text-center" 
                            innerHeight="h-6"
                            outerWidth="w-full rounded-xl"
                            outerHeight="h-7"
                            status={status}
                        >
                            <h1 className="w-full text-light">Overall status</h1>
                        </Pulse>
                    </div>
                </div>
                <div className="h-full bg-darker rounded-xl overflow-auto max-h-full noscroll">
                    {filteredServices.map(service =>
                        <div key={service.name} className={serviceStyle}>
                            <h1>{service.name}</h1>
                            <Pulse status={service.service_status as ServiceStatus} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}