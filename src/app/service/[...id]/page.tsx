import React from 'react'
import Services from '@/components/root/services'
import Logs from '@/components/services/logs'
import getLogs from '@/utils/fetch/getLogs'

export default async function Service({params}: {params: Promise<{ id: string[] }>}) {
    const id = (await params).id[1]
    const logs = await getLogs("server", id === "global" ? "global" : "local")

    return (
        <div className='grid grid-cols-10 gap-2 w-full h-full max-h-full'>
            <div className='hidden rounded-xl lg:grid col-span-3 sm:col-span-2 max-h-[calc((100vh-var(--h-navbar))-1rem)]'>
                <Services />
            </div>
            <div className='col-span-10 lg:col-span-8 max-h-full overflow-auto'>
                <div className="w-full rounded-xl grid grid-cols-6 xl:grid-cols-8 gap-2 h-full max-h-full">
                    <div className={`w-full col-span-6 max-h-full overflow-auto noscroll grid gap-2`}>
                        <div className="w-full h-full max-h-[9vh] flex flex-col gap-2 col-span-6">
                            <div className={`w-full h-full min-h-[9vh] bg-darker rounded-xl px-2 pt-1 cursor-pointer hover:bg-dark`}>
                                <div className="w-full h-full overflow-auto mb-2 noscroll">
                                    <h1 className='text-superlight'>beekeeper $</h1>
                                </div>
                            </div>
                        </div>
                        <div className="w-full h-full max-h-[77vh] flex flex-col gap-2 col-span-6">
                            <Logs logs={logs} />
                        </div>
                        <div className="w-full h-full max-h-[4.7vh] flex flex-col gap-2 col-span-6">
                            <div className={`w-full h-full min-h-[4.7vh] bg-darker rounded-xl pt-1 px-2 pb-2`}>
                                <div className="w-full h-full overflow-auto mb-2 noscroll">
                                    <h1>idk</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='hidden xl:inline-flex flex-col w-full rounded-xl col-span-2 overflow-hidden'>
                        <div className="w-full h-full rounded-xl bg-darker pt-1 px-2">
                            <div className="flex flex-col gap-[0.2rem]">
                                <h1>idk, men noe shortcut relatert innad i namespace, kanskje pods, ingress, service, pdb, etc</h1>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
