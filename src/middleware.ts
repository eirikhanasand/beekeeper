import { NextRequest, NextResponse } from 'next/server'
import { setCookie } from './utils/cookies'

export async function middleware(req: NextRequest) {
    const tokenCookie = req.cookies.get('access_token')
    const groupCookie = req.cookies.get('groups')
    if (!pathIsAllowedWhileUnauthenticated(req.nextUrl.pathname)) {
        if (!tokenCookie || !groupCookie) {
            return NextResponse.redirect(new URL('/', req.url))
        }
        const token = tokenCookie.value
        const validToken = await tokenIsValid(req, token as unknown as string)
        if (!validToken && !pathIsAllowedWhileUnauthenticated(req.nextUrl.pathname)) {
            return NextResponse.redirect(new URL('/logout', req.url))
        }

        const groups = groupCookie.value
        const isTekKom = groups.toLowerCase().includes('tekkom') ? '/service/prod/global' : '/'
        if (!isTekKom) {
            setCookie('imposter', 'true')
            return NextResponse.redirect(new URL('/logout', req.url))
        }
    }
    const theme = req.cookies.get('theme')?.value || 'dark'
    const res = NextResponse.next()
    res.headers.set('x-theme', theme)
    res.headers.set('x-current-path', req.nextUrl.pathname)
    return res
}

function pathIsAllowedWhileUnauthenticated(path: string) {
    if (path === '/' || path === '/favicon.ico') {
        return true
    }

    if (
        path.startsWith('/_next/static/chunks/')
        || path.startsWith('/_next/static/css/')
        || path.startsWith('/_next/image')
        || path.startsWith('/images/')
        || path.startsWith('/login')
        || path.startsWith('/logout')
        || path.startsWith('/_next/webpack-hmr')
    ) {
        return true
    }

    return false
}

async function tokenIsValid(req: NextRequest, token: string): Promise<boolean> {
    const authResponse = await fetch('https://beekeeper-api.login.no/api/token', {
        headers: { Authorization: `Bearer ${token}` }
    })

    if (!authResponse.ok) {
        NextResponse.redirect(new URL('/logout', req.url))
        return false
    }

    return true
}
