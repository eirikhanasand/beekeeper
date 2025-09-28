import { NextResponse } from "next/server"

export async function GET(req: Request) {
    try {
        const urlParam = new URL(req.url).searchParams.get("url")
        if (!urlParam) {
            return NextResponse.json({ ok: false, error: "Missing url parameter" }, { status: 400 })
        }

        const response = await fetch(urlParam, {
            cache: "no-store",
        })

        if (!response.ok) {
            return NextResponse.json(
                { ok: false, error: `Failed to fetch ${req.url}` },
                { status: response.status }
            )
        }

        const data = await response.text()
        return NextResponse.json({ ok: true, data })
    } catch (error) {
        return NextResponse.json(
            { ok: false, error: (error as Error).message },
            { status: 503 }
        )
    }
}
