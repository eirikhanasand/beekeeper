import config from "@/constants"

export default function runCommand(location: 'server' | 'client', command: string) {
    try {
        const url = location === 'server' ? `${config.url.API}/commands/local` : `${process.env.NEXT_PUBLIC_BROWSER_API}/commands/local`
    } catch (error) {
        
    }
}
