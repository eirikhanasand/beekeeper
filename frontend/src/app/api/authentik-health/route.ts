import config from '@/constants'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const response = await fetch(config.url.AUTHENTIK_URL, {
            cache: 'no-store',
        })

        if (!response.ok) {
            throw new Error(await response.text())
        }

        return NextResponse.json({ ok: true })
    } catch (error) {
        console.log(error)
        return NextResponse.json(
            { ok: false, error: (error as Error).message },
            { status: 503 }
        )
    }
}
