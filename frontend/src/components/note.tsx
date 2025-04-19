type NoteProps = {
    display: boolean
    note: string
}

export default function Note({display, note}: NoteProps) {
    if (!display) {
        return <></>
    }

    return (
        <div className='absolute mt-2 w-full h-[5vh] left-0 grid place-items-center'>
            <h1 className='bg-red-500/30 p-2 w-[40vw] rounded-xl text-center'>{note}</h1>
        </div>
    )
}