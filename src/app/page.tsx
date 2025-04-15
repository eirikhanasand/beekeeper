import React from 'react'
import ServiceList from '@/components/root/services'

// Main component of the program, holds the main page and the user can navigate
// to different pages from here
export default async function Home() {
    return (
        <div className='grid grid-cols-10 gap-2 w-full h-full max-h-full'>
            <div className='hidden rounded-xl lg:grid col-span-3 sm:col-span-2 max-h-[calc((100vh-var(--h-navbar))-1rem)]'>
                <ServiceList />
            </div>
            <div className='col-span-10 lg:col-span-8 max-h-full overflow-auto'>
                <div className="w-full rounded-xl grid grid-cols-6 xl:grid-cols-8 gap-2 h-full max-h-full">
                    <div className={`w-full col-span-6 max-h-full overflow-auto noscroll`}>
                        <div className="w-full h-full max-h-[87vh] flex flex-col gap-2 col-span-6">
                            <div className={`w-full h-full min-h-[87vh] bg-darker rounded-xl pt-1 px-2 pb-2 pb-9`}>
                                <div className="w-full h-full overflow-auto mb-2 noscroll grid place-items-center">
                                    <h1 className='text-lg'>BeeKeeper coming soon.</h1>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='hidden xl:inline-flex flex-col w-full rounded-xl col-span-2 overflow-hidden'>
                        <div className="w-full h-full rounded-xl">
                            <div className="flex flex-col gap-[0.2rem]">

                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
