'use client'

import { useState } from "react"
import Log from "./log"
import Paging from "./paging"

type LogProps = {
    logs: (LocalLog | GlobalLog)[]
    namespace: string
    context: string
}

export default function LogClient({logs, namespace, context}: LogProps) {
    const [page, setPage] = useState(1)
    const [items, setItems] = useState(logs)

    return (
        <div className="w-full h-full overflow-auto flex flex-col gap-2 noscroll">
            <Paging
                page={page}
                setPage={setPage}
                items={items}
                setItems={setItems}
                namespace={namespace}
                context={context}
            />
            {!items.length && <h1 className="w-full h-full grid place-items-center text-extralight">No logs found.</h1>}
            {items.map((log) => <Log key={log.id} log={log} />)}
        </div>
    )
}
