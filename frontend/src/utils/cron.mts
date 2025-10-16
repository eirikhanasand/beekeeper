import { schedule } from 'node-cron'
import heartbeat from './heartbeat.mts'

function cron() {
    schedule('* * * * *', async() => {
        await heartbeat()
    })
}

cron()
