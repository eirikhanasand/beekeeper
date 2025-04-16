import Log from "./log"

type LogsProps = {
    logs: Log[]
}

export default function Logs({logs}: LogsProps) {
    return (
        <div className={`w-full h-full min-h-[77vh] bg-darker rounded-xl p-2`}>
            <div className="w-full h-full overflow-auto grid gap-2 noscroll">
                {logs.map((log) => <Log key={log.id} log={log} />)}
            </div>
        </div>
    )
}