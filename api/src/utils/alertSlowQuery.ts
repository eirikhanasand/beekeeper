import config from '@constants'

type Data = {
    content?: string
    embeds: any[]
}

export default async function alertSlowQuery(duration: number, name: string) {
    const lowerCaseName = name.toLowerCase()
    const firstUpperCaseName = `${name.slice(0, 1).toUpperCase()}${name.slice(1).toLowerCase()}`
    if (duration > config.CACHE_TTL / 2 && config.WEBHOOK_URL) {
        let data: Data = {
            embeds: [
                {
                    title: `🐝 BeeKeeper API ${firstUpperCaseName} Query Timing 🐝`,
                    description: `🐝 Slow ${lowerCaseName} query detected: ${duration.toFixed(2)}s`,
                    color: 0xff0000,
                    timestamp: new Date().toISOString()
                }
            ]
        }
        
        if (duration > (config.CACHE_TTL - 1)) {
            data.content = `🚨 <@&${config.CRITICAL_DEVELOPMENT_ROLE}> 🚨`
        }

        console.warn(`${firstUpperCaseName} query exceeded half of cache TTL: ${duration.toFixed(2)}s`)

        await fetch(config.WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        })
    }
}
