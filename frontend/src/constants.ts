import dotenv from 'dotenv'

dotenv.config()

const { NEXT_PUBLIC_API_URL, CDN_URL } = process.env
const { version } = require('../package.json')

const config = {
    url: {
        API: NEXT_PUBLIC_API_URL || 'https://beekeeper-api.login.no/api',
        CDN_URL: CDN_URL || 'https://cdn.login.no'
    },
    version
}

export default config
