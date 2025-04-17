import React from 'react'
import LoggedOutServices from '@/components/root/loggedOutServices'
import Link from 'next/link'
import config from '@/constants'
import { cookies } from 'next/headers'

export default async function Home() {
    const Cookies = await cookies()
    const imposter = Cookies.get('imposter')?.value || false
    return (
        <div className='grid grid-cols-12 gap-2 w-full h-full max-h-full'>
            <div className='hidden rounded-xl lg:grid col-span-3 sm:col-span-2 max-h-[calc((100vh-var(--h-navbar))-1rem)]'>
                <LoggedOutServices  />
            </div>
            <div className='col-span-10 overflow-auto grid grid-cols-12 gap-2 max-h-[calc((100vh-var(--h-navbar))-1rem)]'>
                <div className={`w-full col-span-9 max-h-full overflow-auto noscroll grid gap-2`}>
                    {imposter && <div className='absolute mt-2 w-full h-[5vh] left-0 grid place-items-center'>
                        <h1 className='bg-red-500/30 p-2 px-40 rounded-xl'>Denne tjenesten er kun for TekKom.</h1>
                    </div>}
                    <div className="w-full h-full min-h-[91.7vh] grid place-items-center gap-2 col-span-6 bg-darker rounded-xl">
                        <div className='grid place-items-center h-[10vh]'>
                            <h1 className='text-2xl text-login font-semibold'>
                                BeeKeeper
                            </h1>
                            <Link 
                                href={`${config.url.API_URL}/login`} 
                                className='bg-login text-dark px-5 rounded-xl cursor-pointer'
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='hidden xl:inline-flex flex-col w-full rounded-xl col-span-3 overflow-hidden'>
                    <div className="w-full h-full rounded-xl">
                        <div className="flex flex-col gap-[0.2rem] bg-darker h-full p-2 text-almostbright">
                            Latest service messages
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
