import dotenv from 'dotenv'

dotenv.config()

const { BASE_URL, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, EXAM_URL } = process.env

if (!BASE_URL || !CLIENT_ID || !CLIENT_SECRET || !REDIRECT_URI || !EXAM_URL) {
    throw new Error("Missing one of: BASE_URL, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, EXAM_URL")
}

export { BASE_URL, CLIENT_ID, CLIENT_SECRET, REDIRECT_URI, EXAM_URL }
