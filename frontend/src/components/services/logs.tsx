import Log from "./log"

type LogsProps = {
    logs: (LocalLog | GlobalLog)[]
}

export default function Logs({logs}: LogsProps) {
    return (
        <div className={`w-full h-full bg-darker rounded-xl p-2`}>
            <div className="w-full max-h-full overflow-auto grid gap-2 noscroll">
                {logs.map((log) => <Log key={log.id} log={log} />)}
            </div>
        </div>
    )
}
