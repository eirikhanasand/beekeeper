import config from "@/constants"

const API_URL = process.env.NEXT_PUBLIC_BROWSER_API

export default function runCommand(location: 'server' | 'client', command: string) {
    try {
        const url = location === 'server' ? `${config.url.API}/commands/local` : `${API_URL}/commands/local`
    } catch (error) {
        
    }
}
