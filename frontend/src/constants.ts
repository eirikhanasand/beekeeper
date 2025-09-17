const { NEXT_PUBLIC_API_URL, CDN_URL } = process.env
const { version } = require('../package.json')

const config = {
    url: {
        API: NEXT_PUBLIC_API_URL || 'https://api.beekeeper.login.no/api',
        CDN_URL: CDN_URL || 'https://cdn.login.no',
        AUTHENTIK_URL: 'https://authentik.login.no',
    },
    version
}

export default config
