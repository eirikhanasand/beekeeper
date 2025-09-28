import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const urlParam = new URL(req.url).searchParams.get("url")
        if (!urlParam) {
            return NextResponse.json(
                { ok: false, error: "Missing url parameter" },
                { status: 400 }
            )
        }

        const controller = new AbortController()
        const timeout = setTimeout(() => controller.abort(), 1000)

        try {
            const response = await fetch(urlParam, {
                next: { revalidate: 3 },
                signal: controller.signal,
            })

            if (!response.ok) {
                return NextResponse.json(
                    { ok: false, error: `Failed to fetch ${urlParam}` },
                    { status: response.status }
                )
            }

            const data = await response.text()
            return NextResponse.json({ ok: true, data })
        } finally {
            clearTimeout(timeout)
        }
    } catch (error) {
        return NextResponse.json(
            { ok: false, error: (error as Error).message },
            { status: 503 }
        )
    }
}
