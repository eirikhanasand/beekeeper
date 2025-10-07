import config from '@/constants'
import debug from '@/utils/debug'
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
        debug({ basic: error })
        return NextResponse.json(
            { ok: false, error: (error as Error).message },
            { status: 503 }
        )
    }
}
