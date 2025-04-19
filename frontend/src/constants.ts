import dotenv from 'dotenv'

dotenv.config()

const { API_URL, CDN_URL } = process.env
const { version } = require('../package.json')

const config = {
    url: {
        API: API_URL || 'https://beekeeper-api.login.no/api',
        CDN_URL: CDN_URL || 'https://cdn.login.no'
    },
    version
}

export default config

console.log("denne", process.env.NEXT_PUBLIC_BROWSER_API)