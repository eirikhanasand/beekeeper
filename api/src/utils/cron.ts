import { schedule } from 'node-cron'
import checkMaxConnectionsCron from './maxConnections.js'
import heartbeat from './heartbeat.js'

export default function cron() {
    checkMaxConnectionsCron()
    schedule('* * * * *', async() => {
        heartbeat()
    })
}
