import dotenv from 'dotenv'

dotenv.config()

const { API_URL, BROWSER_API_URL } = process.env

export const API = API_URL || 'https://beekeeper-api.login.no/api'
export const BROWSER_API = BROWSER_API_URL || 'https://beekeeper-api.login.no/api'
// export const API = API_URL || 'https://beekeeper-api.login.no/api'
// export const BROWSER_API = BROWSER_API_URL || 'https://beekeeper-api.login.no/api'