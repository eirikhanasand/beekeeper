import dotenv from 'dotenv'

type ENV = { 
    API_URL: string
    BROWSER_API_URL: string
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
}

dotenv.config({path: '../.env'})

const {
    DB_PORT,
    DB_MAX_CONN,
    DB_IDLE_TIMEOUT_MS,
    DB_TIMEOUT_MS,
    API_URL,
    BROWSER_API_URL,
    DOCTL_TOKEN,
    PRIVATE_TOKEN,
    DB,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
} = process.env as unknown as ENV
if (!DOCTL_TOKEN
    || !PRIVATE_TOKEN
    || !DB
    || !DB_HOST
    || !DB_USER
    || !DB_PASSWORD
) {
    throw new Error("Missing one or more environment variables.")
}

const config = {
    DB_PORT,
    DB_MAX_CONN,
    DB_IDLE_TIMEOUT_MS,
    DB_TIMEOUT_MS,
    API_URL,
    BROWSER_API_URL,
    DOCTL_TOKEN,
    PRIVATE_TOKEN,
    DB,
    DB_HOST,
    DB_USER,
    DB_PASSWORD,
}

export default config
