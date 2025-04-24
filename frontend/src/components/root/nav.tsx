import Image from 'next/image'
import Link from 'next/link'
import ToolTips from './toolTips'
import Menu from './menu'
import { RightSide } from './clientNav'
import ArrowOutward from '@/components/svg/arrowOutward'

export default function Navbar() {
    return (
        <div className='flex justify-between bg-black h-full w-full md:px-[1rem] gap-2 overflow-hidden'>
            <Menu />
            <ToolTips />
            {/* logo */}
            <div className='flex items-center h-[3rem] md:w-[10rem]'>
                <Link href='/' className='relative block h-8 w-8'>
                    <Image 
                        src={'/images/logo/logo.svg'}
                        className='object-cover'
                        alt="logo" 
                        fill={true}
                     />
                </Link>
            </div>
            <nav className='flex justify-between items-center w-fill max-w-[40rem]'>
                <Link href='https://login.no'>
                    <li className='text-white flex flex-row items-center list-none no-underline leading-[1rem] p-3 pr-[1.5rem] font-medium cursor-pointer link--corner-hover'>
                        Login
                        <ArrowOutward className='absolute right-[0.25rem] w-[1rem] h-[1rem] fill-login'/>
                    </li>
                </Link>
            </nav>
            {/* account, login */}
            <RightSide />
        </div>
    )
}
