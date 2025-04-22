import dotenv from 'dotenv'

type ENV = { 
    NEXT_PUBLIC_API_URL: string
    DOCTL_TOKEN: string
    PRIVATE_TOKEN: string
    DB: string
    DB_HOST: string
    DB_USER: string
    DB_PASSWORD: string
    DB_PORT: string
    DB_MAX_CONN: string
    DB_IDLE_TIMEOUT_MS: string
    DB_TIMEOUT_MS: string
    CLIENT_ID: string
    CLIENT_SECRET: string
    REDIRECT_URI: string
    BASE_URL: string
    BEEKEEPER_URL: string
    AUTHENTIK_TOKEN: string
}

dotenv.config({path: '../.env'})

const {
    DB_PORT,
    DB_MAX_CONN,
    DB_IDLE_TIMEOUT_MS,
    DB_TIMEOUT_MS,
    NEXT_PUBLIC_API_URL,
    DOCTL_TOKEN,
    PRIVATE_TOKEN,
    DB,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
    BASE_URL,
    BEEKEEPER_URL,
    AUTHENTIK_TOKEN
} = process.env as unknown as ENV
if (!DOCTL_TOKEN
    || !PRIVATE_TOKEN
    || !DB
    || !DB_HOST
    || !DB_USER
    || !DB_PASSWORD
    || !CLIENT_ID
    || !CLIENT_SECRET
    || !REDIRECT_URI
    || !BASE_URL
    || !BEEKEEPER_URL
    || !AUTHENTIK_TOKEN
) {
    throw new Error("Missing one or more environment variables.")
}

const AUTH_URL = `${BASE_URL}/application/o/authorize/`
const TOKEN_URL = `${BASE_URL}/application/o/token/`
const USERINFO_URL = `${BASE_URL}/application/o/userinfo/`
const USER_ENDPOINT = `${BASE_URL}/api/v3/core/users/`

const config = {
    DB_PORT,
    DB_MAX_CONN,
    DB_IDLE_TIMEOUT_MS,
    DB_TIMEOUT_MS,
    API_URL,
    DOCTL_TOKEN,
    PRIVATE_TOKEN,
    DB,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI,
    AUTH_URL,
    TOKEN_URL,
    USERINFO_URL,
    BEEKEEPER_URL,
    USER_ENDPOINT,
    AUTHENTIK_TOKEN
}

export default config
