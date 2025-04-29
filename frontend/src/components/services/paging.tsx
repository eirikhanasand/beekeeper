import getLogs from '@/utils/fetch/log/get'
import { ReadonlyURLSearchParams, usePathname, useRouter } from 'next/navigation'
import { Dispatch, RefObject, SetStateAction, useEffect, useRef, useState } from 'react'

type PagingProps = {
    page: number
    setPage: Dispatch<SetStateAction<number>>
    resultsPerPage: number
    items: (LocalLog | GlobalLog)[]
    setItems: Dispatch<SetStateAction<(LocalLog | GlobalLog)[]>>
    setResultsPerPage: Dispatch<SetStateAction<number>>
    searchParams: ReadonlyURLSearchParams
    namespace: string
    customStyle?: string
}

type InputButtonsProps = {
    setPage: Dispatch<SetStateAction<number>>
    page: number
    lastPage: number
    buttonStyle: string
    activeButtonStyle: string
    unClickableButtonStyle: string
    containerRef: RefObject<null>
}

export default function Paging({
    page,
    setPage,
    resultsPerPage,
    items,
    setItems,
    setResultsPerPage,
    searchParams,
    customStyle,
    namespace
}: PagingProps) {
    const unClickableButtonStyle = 'bg-light rounded-md p-1 px-3 hover:bg-extralight h-[2rem] min-w-[2rem]'
    const buttonStyle = 'bg-light rounded-md p-1 px-3 hover:bg-extralight grid place-items-center cursor-pointer'
    const activeButtonStyle = 'bg-login hover:bg-orange-500 rounded-md p-1 px-3 grid place-items-center h-[2rem] text-white'
    const containerRef = useRef(null)
    const router = useRouter()
    const path = usePathname()
    const isGlobal = path.includes('global')
    const [search, setSearch] = useState("")
    const [error, setError] = useState('')
    const [pages, setPages] = useState(1)

    useEffect(() => {
        const params = new URLSearchParams(searchParams)
        if (page <= pages) {
            params.set('page', String(page))
            router.replace(`?${params.toString()}`)
        } else {
            params.set('page', String(1))
            router.replace(`?${params.toString()}`)
            window.location.reload()
        }
    }, [page])

    useEffect(() => {
        (async () => {
            const logs = await getLogs({
                location: 'client',
                path: isGlobal ? 'global' : 'local',
                page,
                namespace,
                search,
                resultsPerPage
            })

            if (logs) {
                if ('error' in logs && logs.error !== undefined) {
                    setError(logs.error)
                } else {
                    setItems(logs.results)
                    setPages(logs.pages)
                }
            }
        })()
    }, [search, resultsPerPage, page])

    return (
        <div className='w-full flex gap-2 items-center px-[3px] pt-1'>
            <input
                className={`${buttonStyle} flex-1`}
                placeholder='Search...'
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                maxLength={200}
            />
            <InputButtons
                setPage={setPage}
                page={page}
                lastPage={pages}
                buttonStyle={buttonStyle}
                activeButtonStyle={activeButtonStyle}
                unClickableButtonStyle={unClickableButtonStyle}
                containerRef={containerRef}
            />
            <div className={`flex w-fit h-fit justify-between items-center overflow-hidden ${customStyle}`}>
                <div className='flex justify-between gap-2 cursor-pointer select-none'>
                    <h1 className={`${unClickableButtonStyle} min-w-fit ${items.length >= 100 ? 'text-sm' : ''} flex items-center`}>
                        Page {page} / {pages}
                    </h1>
                    <div className='flex gap-2'>
                        <h1
                            onClick={() => setResultsPerPage(25)}
                            className={resultsPerPage === 25 ? activeButtonStyle : buttonStyle}
                        >
                            25
                        </h1>
                        <h1
                            onClick={() => setResultsPerPage(50)}
                            className={resultsPerPage === 50 ? activeButtonStyle : buttonStyle}
                        >
                            50
                        </h1>
                        {
                            items.length >= 100
                                ? <h1
                                    onClick={() => setResultsPerPage(50)}
                                    className={resultsPerPage === 100 ? activeButtonStyle : buttonStyle}
                                >100</h1> : <></>}
                    </div>
                </div>
            </div>
        </div>
    )
}

function InputButtons({
    page,
    setPage,
    lastPage,
    buttonStyle,
    activeButtonStyle,
    unClickableButtonStyle,
    containerRef,
}: InputButtonsProps) {
    const [customPage, setCustomPage] = useState(page)
    const [displayCustom, setDisplayCustom] = useState(false)
    const twoBack = page - 2
    const previous = page - 1
    const next = page + 1
    const twoForward = page + 2

    useEffect(() => {
        setCustomPage(page)
    }, [page])

    return (
        <div ref={containerRef} className='flex gap-2 select-none'>
            {previous >= 1
                ? <h1 onClick={() => setPage(previous)} className={buttonStyle}>{'<'}</h1>
                : <h1 className={unClickableButtonStyle} />
            }
            {twoBack >= 1
                ? <h1 onClick={() => setPage(twoBack)} className={buttonStyle}>{twoBack}</h1>
                : <h1 className={unClickableButtonStyle} />
            }
            {previous >= 1
                ? <h1 onClick={() => setPage(previous)} className={buttonStyle}>{previous}</h1>
                : <h1 className={unClickableButtonStyle} />
            }
            <h1 className={activeButtonStyle}>{page}</h1>
            {lastPage > 1 ? <div
                onMouseEnter={() => { setDisplayCustom(true) }}
                onMouseLeave={() => setDisplayCustom(false)}
            >
                {displayCustom ? <input
                    type='number'
                    min={1}
                    max={lastPage}
                    className={buttonStyle}
                    placeholder='...'
                    value={customPage}
                    onChange={(event) => {
                        setCustomPage(Number(event.target.value));
                        setPage(Number(event.target.value))
                    }}
                /> : <h1 className={buttonStyle}>...</h1>}
            </div> : <></>}
            {next <= lastPage
                ? <h1 onClick={() => setPage(next)} className={buttonStyle}>{next}</h1>
                : <h1 className={unClickableButtonStyle} />
            }
            {lastPage >= twoForward
                ? <h1 onClick={() => setPage(twoForward)} className={buttonStyle}>{lastPage}</h1>
                : <h1 className={unClickableButtonStyle} />
            }
            {next <= lastPage
                ? <h1 onClick={() => setPage(next)} className={buttonStyle}>{'>'}</h1>
                : <h1 className={unClickableButtonStyle} />
            }
        </div>
    )
}
