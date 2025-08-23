export default function timeDiffFromNow(targetDate: string) {
    const now = new Date()
    const target = new Date(targetDate)
    if (isNaN(target.getTime())) {
        return '?'
    }
    const diffMs = Math.abs(now.getTime() - target.getTime())
    const seconds = Math.floor(diffMs / 1000)
    const minutes = Math.floor(seconds / 60)
    const hours = Math.floor(minutes / 60)
    const days = Math.floor(hours / 24)

    // less than 1 minute: seconds only
    if (seconds < 60) {
        return `${seconds}s`
    // less than 5 minutes: minutes and seconds
    } else if (minutes < 5) {
        return `${minutes}m ${seconds % 60}s`
    // less than 1 hour: minutes only
    } else if (minutes < 60) {
        return `${minutes}m`
    // less than 1 day: hours and minutes
    } else if (hours < 24) {
        return `${hours}h ${minutes % 60}m`
    // less than 7 days: days and hours
    } else if (days < 7) {
        return `${days}d ${hours % 24}h`
    // 7 days or more: days only
    } else {
        return `${days}d`
    }
}
