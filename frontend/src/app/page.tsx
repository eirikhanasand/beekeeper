import React from 'react'
import LoggedOutServices from '@/components/root/loggedOutServices'
import Link from 'next/link'
import { cookies } from 'next/headers'
import Note from '@/components/services/note'
import getMessages from '@/utils/fetch/message/get'
import Message from '@/components/services/message'

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default async function Home() {
    const Cookies = await cookies()
    const imposter = Boolean(Cookies.get('imposter')?.value)
    const invalidToken = Boolean(Cookies.get('invalidToken')?.value)
    const messages = await getMessages('server')

    return (
        <div className='grid grid-cols-12 gap-2 w-full h-full max-h-full'>
            <div className='rounded-xl grid col-span-3 sm:col-span-2 max-h-[calc((100vh-var(--h-navbar))-1rem)]'>
                <LoggedOutServices />
            </div>
            <div className='col-span-10 overflow-auto grid grid-cols-12 gap-2 max-h-[calc((100vh-var(--h-navbar))-1rem)]'>
                <div className={`w-full col-span-9 max-h-full overflow-auto noscroll grid gap-2`}>
                    <Note display={imposter} note="This service is only for TekKom." />
                    <Note display={invalidToken} note="Reauthentication required." />
                    <div className="w-full h-full min-h-[91.7vh] grid place-items-center gap-2 col-span-6 bg-darker rounded-xl">
                        <div className='grid place-items-center h-[10vh]'>
                            <h1 className='text-2xl text-login font-semibold'>
                                BeeKeeper
                            </h1>
                            <Link 
                                href={`${API_URL}/login`} 
                                className='bg-login text-dark px-5 rounded-xl cursor-pointer'
                            >
                                Login
                            </Link>
                        </div>
                    </div>
                </div>
                <div className='inline-flex flex-col w-full rounded-xl col-span-3 overflow-hidden h-full flex gap-2 bg-darker p-2'>
                    <h1 className='text-almostbright'>Latest service messages</h1>
                    <div className="flex flex-col h-full overflow-auto noscroll gap-2">
                        {messages.map((message) => <Message 
                            key={message.id} 
                            message={message}
                            shrink={true}
                        />)}
                    </div>
                </div>
            </div>
        </div>
    )
}
