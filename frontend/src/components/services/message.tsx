import { ServiceStatus } from "@/interfaces"
import getAuthor from "@/utils/fetch/user/getUser"
import Pulse from "../root/pulse"

type MessageProps = {
    message: Message
    shrink?: true
}

export default async function Message({ message, shrink }: MessageProps) {
    const { title, author: Author, status, content, timestamp } = message
    const serviceStatus = {
        'Investigating': ServiceStatus.DOWN,
        'Identified': ServiceStatus.DEGRADED,
        'Resolved': ServiceStatus.OPERATIONAL,
    }[status] || ServiceStatus.INACTIVE
    const author = await getAuthor('server', Author)
    return (
        <div className="bg-light rounded-lg p-1 px-2">
            <div className="flex justify-between items-center">
                <h1 className="font-semibold">{title}</h1>
                <Pulse status={serviceStatus} />
            </div>
            <h1 className={shrink ? 'text-xs' : 'text-sm'}>{content}</h1>
            <div className={`flex justify-between text-superlight ${shrink ? 'text-xs' : 'text-sm'}`}>
                <h1>Posted by {author && 'name' in author ? author.name : 'Unknown User'}</h1>
                <h1>{new Date(timestamp).toLocaleString('no-NO')}</h1>
            </div>
        </div>
    )
}
