'use client'

export function Burger() {
    function handleClick() {
        const menu = document.querySelector('.menu')

        if (menu) {
            menu.classList.toggle('hidden')
        }
    }

    return (
        <div className='lg:hidden grid place-self-center w-[4vh] h-[4vh] relative' onClick={handleClick}>
            <div className='bg-white rounded-xl h-[3px] self-center' />
            <div className='bg-white rounded-xl h-[3px] self-center' />
            <div className='bg-white rounded-xl h-[3px] self-center' />
        </div>
    )
}
